const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../../dist/app');
const { config } = require('../../dist/config');
const { requireAuth } = require('../../dist/middleware/auth');

const app = createApp();

describe('Gebere Vision AI / Oomisha360 - Authentication & Security Test Suite', () => {
  
  describe('1. Unauthenticated & Protected Endpoint Rejection', () => {
    it('rejects requests with missing Authorization header (401 Unauthorized)', async () => {
      const res = await request(app).get('/api/v1/farms');
      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'UNAUTHORIZED');
      assert.ok(res.body.error.message.includes('token is required'));
    });

    it('rejects arbitrary, non-demo invalid tokens (401 Unauthorized)', async () => {
      const res = await request(app)
        .get('/api/v1/farms')
        .set('Authorization', 'Bearer totally-bogus-token-xyz');

      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'UNAUTHORIZED');
    });

    it('rejects expired or forged JWT tokens (401 Unauthorized)', async () => {
      // Fake expired JWT with timestamp from 2020
      const expiredJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyNDAwMDB9.fakeSignature';
      const res = await request(app)
        .get('/api/v1/farms')
        .set('Authorization', `Bearer ${expiredJwt}`);

      assert.equal(res.status, 401);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'UNAUTHORIZED');
    });
  });

  describe('2. Production Mode Security Enforcement', () => {
    it('strictly forbids demo tokens whenever NODE_ENV=production', async () => {
      // Temporarily simulate production mode
      const originalIsProd = config.isProduction;
      config.isProduction = true;

      try {
        const res = await request(app)
          .get('/api/v1/farms')
          .set('Authorization', 'Bearer demo-user-farmer-1');

        assert.equal(res.status, 401);
        assert.equal(res.body.success, false);
        assert.ok(
          res.body.error.message.includes('prohibited in production') ||
            res.body.error.message.includes('forbidden in production')
        );
      } finally {
        config.isProduction = originalIsProd;
      }
    });

    it('strictly forbids x-demo-user-id header whenever NODE_ENV=production', async () => {
      const originalIsProd = config.isProduction;
      config.isProduction = true;

      try {
        const res = await request(app)
          .get('/api/v1/farms')
          .set('x-demo-user-id', 'farmer-hacker');

        assert.equal(res.status, 401);
        assert.equal(res.body.success, false);
        assert.ok(res.body.error.message.includes('prohibited in production'));
      } finally {
        config.isProduction = originalIsProd;
      }
    });
  });

  describe('3. User ID Derivation & Client Tampering Protection', () => {
    it('derives user ID strictly from the verified token and ignores malicious body.userId', async () => {
      const res = await request(app)
        .post('/api/v1/farms')
        .set('Authorization', 'Bearer demo-user-verified-alice')
        .send({
          name: 'Alice Security Verification Farm',
          region: 'Oromia',
          zone: 'Bale',
          woreda: 'Goba',
          totalHectares: 2.5,
          primaryCrop: 'Wheat',
          userId: 'malicious-injected-user-id', // Attacker attempts to impersonate another ID
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      // The saved userId MUST match the verified token, never the body payload!
      assert.equal(res.body.data.userId, 'verified-alice');
      assert.notEqual(res.body.data.userId, 'malicious-injected-user-id');
    });
  });

  describe('4. Cross-Tenant IDOR Protection', () => {
    let aliceFarmId;

    it('Alice creates a private farm', async () => {
      const res = await request(app)
        .post('/api/v1/farms')
        .set('Authorization', 'Bearer demo-user-alice-priv')
        .send({
          name: 'Alice Private Holding',
          region: 'Oromia',
          zone: 'East Shewa',
          woreda: 'Bishoftu',
          totalHectares: 5.0,
          primaryCrop: 'Teff',
        });

      assert.equal(res.status, 201);
      aliceFarmId = res.body.data.id;
    });

    it('Bob is strictly blocked from reading Alice\'s private farm (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/v1/farms/${aliceFarmId}`)
        .set('Authorization', 'Bearer demo-user-bob-priv');

      assert.equal(res.status, 403);
      assert.equal(res.body.error.code, 'FORBIDDEN');
    });

    it('Bob is strictly blocked from modifying Alice\'s farm (403 Forbidden)', async () => {
      const res = await request(app)
        .patch(`/api/v1/farms/${aliceFarmId}`)
        .set('Authorization', 'Bearer demo-user-bob-priv')
        .send({ name: 'Bob Stolen Farm' });

      assert.equal(res.status, 403);
      assert.equal(res.body.error.code, 'FORBIDDEN');
    });

    it('Bob is strictly blocked from deleting Alice\'s farm (403 Forbidden)', async () => {
      const res = await request(app)
        .delete(`/api/v1/farms/${aliceFarmId}`)
        .set('Authorization', 'Bearer demo-user-bob-priv');

      assert.equal(res.status, 403);
      assert.equal(res.body.error.code, 'FORBIDDEN');
    });
  });

  describe('5. Auth Status & Non-Destructive Data Claiming', () => {
    it('GET /api/v1/auth/status reports authentication configuration status', async () => {
      const res = await request(app).get('/api/v1/auth/status');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(typeof res.body.data.supabaseAuthConfigured, 'boolean');
      assert.equal(typeof res.body.data.isProduction, 'boolean');
      assert.equal(typeof res.body.data.demoTokensAllowed, 'boolean');
    });

    it('POST /api/v1/auth/claim-demo-data transfers records non-destructively to real account', async () => {
      // 1. Create a dummy plot under a temporary demo tag
      const tempDemoId = 'demo-temp-worker-' + Date.now();
      const plotRes = await request(app)
        .post('/api/v1/land/records')
        .set('Authorization', `Bearer demo-user-${tempDemoId}`)
        .send({
          plotName: 'Temporary Unclaimed Plot',
          crop: 'Teff',
          calculationMethod: 'rectangular',
          length: 100,
          width: 50,
          lengthUnit: 'meters',
          widthUnit: 'meters',
        });
      assert.equal(plotRes.status, 201);
      const plotId = plotRes.body.data.id;

      // 2. Real user claims the records
      const claimRes = await request(app)
        .post('/api/v1/auth/claim-demo-data')
        .set('Authorization', 'Bearer demo-user-real-claimant')
        .send({ demoUserId: tempDemoId });

      assert.equal(claimRes.status, 200);
      assert.equal(claimRes.body.success, true);
      assert.ok(claimRes.body.transferred.plots >= 1);

      // 3. Verify real user now owns the plot
      const verifyRes = await request(app)
        .get(`/api/v1/land/records/${plotId}`)
        .set('Authorization', 'Bearer demo-user-real-claimant');

      assert.equal(verifyRes.status, 200);
      assert.equal(verifyRes.body.data.userId, 'real-claimant');
    });

    it('POST /api/v1/auth/claim-demo-data blocks attempts to steal records from non-demo users (403 Forbidden)', async () => {
      const maliciousRes = await request(app)
        .post('/api/v1/auth/claim-demo-data')
        .set('Authorization', 'Bearer demo-user-attacker')
        .send({ demoUserId: 'victim-user-alice' });

      assert.equal(maliciousRes.status, 403);
      assert.equal(maliciousRes.body.error.code, 'FORBIDDEN');
    });
  });
});
