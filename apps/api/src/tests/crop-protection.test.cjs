const { test, describe, before } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../../dist/app.js');

describe('Crop Protection & Agricultural Medicines Test Suite', () => {
  let app;

  const supplierA = {
    authHeader: 'Bearer demo-user-farmer-1',
    id: 'usr-demo-farmer-1',
  };

  const supplierB = {
    authHeader: 'Bearer demo-user-farmer-2',
    id: 'usr-demo-farmer-2',
  };

  before(() => {
    app = createApp();
  });

  describe('1. Product Registry & Public Discovery', () => {
    test('GET /api/v1/crop-protection/products returns registered products', async () => {
      const res = await request(app).get('/api/v1/crop-protection/products');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data));
      assert.ok(res.body.data.length >= 8, 'Expected at least 8 verified Ethiopian registered products');

      // Check structure of first product
      const p = res.body.data[0];
      assert.ok(p.id);
      assert.ok(p.tradeName);
      assert.ok(p.activeIngredient);
      assert.ok(p.registrationNumber);
      assert.ok(p.category);
    });

    test('GET /api/v1/crop-protection/products?category=fungicide filters by category', async () => {
      const res = await request(app).get('/api/v1/crop-protection/products?category=fungicide');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      for (const prod of res.body.data) {
        assert.equal(prod.category, 'fungicide');
      }
    });

    test('GET /api/v1/crop-protection/products?crop=Coffee filters by supported crop', async () => {
      const res = await request(app).get('/api/v1/crop-protection/products?crop=Coffee');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      for (const prod of res.body.data) {
        const matches = prod.supportedCrops.some((c) => c.toLowerCase().includes('coffee'));
        assert.ok(matches, `Product ${prod.tradeName} should support Coffee`);
      }
    });

    test('GET /api/v1/crop-protection/products?query=Tilt finds matching product by brand/name', async () => {
      const res = await request(app).get('/api/v1/crop-protection/products?query=Tilt');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.length >= 1);
      assert.ok(res.body.data.some((p) => p.brandName && p.brandName.includes('Tilt')));
    });

    test('GET /api/v1/crop-protection/products/:id returns full detail with approved uses', async () => {
      const res = await request(app).get('/api/v1/crop-protection/products/prod-copper-oxychloride');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.id, 'prod-copper-oxychloride');
      assert.ok(Array.isArray(res.body.data.approvedUses));
      assert.ok(res.body.data.approvedUses.length > 0);
      assert.ok(res.body.data.ppeRequirements.length > 0);
      assert.ok(res.body.data.safetyPrecautions.length > 0);
      assert.ok(res.body.data.withholdingPeriodDays > 0);
    });

    test('GET /api/v1/crop-protection/products/:id returns 404 for unknown product', async () => {
      const res = await request(app).get('/api/v1/crop-protection/products/non-existent-product-id');
      assert.equal(res.status, 404);
      assert.equal(res.body.success, false);
    });
  });

  describe('2. Agricultural IPM Guidance Matching', () => {
    test('GET /api/v1/crop-protection/guidance returns IPM recommendations and safety notices', async () => {
      const res = await request(app).get('/api/v1/crop-protection/guidance?crop=coffee&disease=rust');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.crop, 'Coffee');
      assert.ok(res.body.data.ipmRecommendation);
      assert.ok(res.body.data.safetyNotice);
      assert.ok(res.body.data.safetyNotice.includes('SAFETY MANDATE'));
      assert.ok(Array.isArray(res.body.data.culturalPractices));
      assert.ok(Array.isArray(res.body.data.registeredProducts));
    });

    test('GET /api/v1/crop-protection/guidance with wheat returns registered fungicides', async () => {
      const res = await request(app).get('/api/v1/crop-protection/guidance?crop=wheat&disease=stripe');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.crop, 'Wheat');
      assert.ok(res.body.data.registeredProducts.length > 0);
    });
  });

  describe('3. Supplier Listings & Authorization Rules', () => {
    let createdListingId;

    test('GET /api/v1/crop-protection/listings returns active offers across Oromia', async () => {
      const res = await request(app).get('/api/v1/crop-protection/listings');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data));
      assert.ok(res.body.data.length >= 8);
    });

    test('POST /api/v1/crop-protection/listings blocks unauthenticated users (401)', async () => {
      const res = await request(app)
        .post('/api/v1/crop-protection/listings')
        .send({
          productId: 'prod-copper-oxychloride',
          supplierName: 'Anonymous Dealer',
          packageSize: '1 kg packet',
          priceAmount: 850,
          region: 'Oromia',
          zone: 'East Shewa',
          woreda: 'Bishoftu',
          contactPhone: '+251 91 123 4567',
        });
      assert.equal(res.status, 401);
    });

    test('POST /api/v1/crop-protection/listings blocks unregistered fake products (Registration Check)', async () => {
      const res = await request(app)
        .post('/api/v1/crop-protection/listings')
        .set('Authorization', supplierA.authHeader)
        .send({
          productId: 'fake-unregistered-chemical-x',
          supplierName: 'Illegal Vendor',
          packageSize: '1 Liter',
          priceAmount: 999,
          region: 'Oromia',
          zone: 'East Shewa',
          woreda: 'Bishoftu',
          contactPhone: '+251 91 123 4567',
        });
      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.ok(res.body.error.message.includes('not registered'));
    });

    test('POST /api/v1/crop-protection/listings allows authenticated dealer to create listing for registered product', async () => {
      const res = await request(app)
        .post('/api/v1/crop-protection/listings')
        .set('Authorization', supplierA.authHeader)
        .send({
          productId: 'prod-copper-oxychloride',
          supplierName: 'Adaa Farmers Coop Union Test',
          storeName: 'Bishoftu Branch',
          licenseNumber: 'ETH-OR-AG-TEST-001',
          packageSize: '1 kg pouch',
          priceAmount: 840,
          currency: 'ETB',
          region: 'Oromia',
          zone: 'East Shewa',
          woreda: 'Bishoftu',
          contactPhone: '+251 91 999 8877',
        });
      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.id);
      assert.equal(res.body.data.priceAmount, 840);
      createdListingId = res.body.data.id;
    });

    test('PATCH /api/v1/crop-protection/listings/:id blocks Supplier B from modifying Supplier A listing (403)', async () => {
      const res = await request(app)
        .patch(`/api/v1/crop-protection/listings/${createdListingId}`)
        .set('Authorization', supplierB.authHeader)
        .send({
          priceAmount: 100, // Malicious price tampering
        });
      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
    });

    test('PATCH /api/v1/crop-protection/listings/:id allows Supplier A to update their own listing', async () => {
      const res = await request(app)
        .patch(`/api/v1/crop-protection/listings/${createdListingId}`)
        .set('Authorization', supplierA.authHeader)
        .send({
          priceAmount: 830,
        });
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.priceAmount, 830);
    });

    test('POST /api/v1/crop-protection/listings/:id/inquiries allows farmer to send inquiry', async () => {
      const res = await request(app)
        .post(`/api/v1/crop-protection/listings/${createdListingId}/inquiries`)
        .send({
          senderName: 'Gemechu Desta',
          senderPhone: '+251 92 111 2233',
          message: 'Is this available for pickup tomorrow morning?',
          quantityRequested: 5,
        });
      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.id);
      assert.equal(res.body.data.senderName, 'Gemechu Desta');
    });

    test('DELETE /api/v1/crop-protection/listings/:id blocks Supplier B from deleting Supplier A listing (403)', async () => {
      const res = await request(app)
        .delete(`/api/v1/crop-protection/listings/${createdListingId}`)
        .set('Authorization', supplierB.authHeader);
      assert.equal(res.status, 403);
    });

    test('DELETE /api/v1/crop-protection/listings/:id allows Supplier A to delete their listing', async () => {
      const res = await request(app)
        .delete(`/api/v1/crop-protection/listings/${createdListingId}`)
        .set('Authorization', supplierA.authHeader);
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
    });
  });
});
