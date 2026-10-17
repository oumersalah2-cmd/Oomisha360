const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../../dist/app');
const { config } = require('../../dist/config');

const app = createApp();

describe('Gebere Vision AI - Backend API Integration Suite', () => {
  const userAToken = 'demo-user-farmer-a';
  const userBToken = 'demo-user-farmer-b';

  describe('1. Health Checks', () => {
    it('GET /api/v1/health returns 200 with service information and database status', async () => {
      const res = await request(app).get('/api/v1/health');
      assert.equal(res.status, 200);
      assert.equal(res.body.status, 'healthy');
      assert.equal(res.body.service, 'gebere-vision-api');
      assert.ok(res.body.database);
    });
  });

  describe('2. Land Measurement & Calculation Engine', () => {
    it('calculates rectangular plot area accurately and returns disclaimers', async () => {
      const res = await request(app)
        .post('/api/v1/land/calculate')
        .send({
          method: 'rectangular',
          length: 200,
          width: 100,
          lengthUnit: 'meters',
          widthUnit: 'meters',
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.squareMeters, 20000);
      assert.equal(res.body.data.hectares, 2);
      assert.ok(Math.abs(res.body.data.acres - 4.9421) < 0.01);
      assert.equal(res.body.data.isEstimate, false);
      assert.ok(res.body.data.disclaimer.includes('Rectangular calculations assume straight'));
    });

    it('rejects invalid or negative land dimensions with 400 validation error', async () => {
      const res = await request(app)
        .post('/api/v1/land/calculate')
        .send({
          method: 'rectangular',
          length: -50,
          width: 100,
          lengthUnit: 'meters',
          widthUnit: 'meters',
        });

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'VALIDATION_ERROR');
    });

    it('estimates polygon plot area from geographic coordinates and labels as estimate', async () => {
      const res = await request(app)
        .post('/api/v1/land/calculate')
        .send({
          method: 'polygon',
          coordinates: [
            { lat: 8.750, lng: 38.980 },
            { lat: 8.752, lng: 38.980 },
            { lat: 8.752, lng: 38.982 },
            { lat: 8.750, lng: 38.982 },
          ],
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.squareMeters > 10000);
      assert.equal(res.body.data.isEstimate, true);
      assert.ok(res.body.data.disclaimer.includes('Notice: Map polygon calculations are mathematical estimates'));
    });
  });

  describe('2B. Land Plot CRUD & Ownership Enforcement', () => {
    let createdPlotId;

    it('User A saves a rectangular plot with designated crop (Teff)', async () => {
      const res = await request(app)
        .post('/api/v1/land/records')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          plotName: 'Bishoftu South Parcel 1',
          crop: 'Teff',
          calculationMethod: 'rectangular',
          length: 150,
          width: 80,
          lengthUnit: 'meters',
          widthUnit: 'meters',
          notes: 'High yield potential black soil plot',
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.plotName, 'Bishoftu South Parcel 1');
      assert.equal(res.body.data.crop, 'Teff');
      assert.equal(res.body.data.areaSquareMeters, 12000);
      assert.equal(res.body.data.areaHectares, 1.2);
      assert.equal(res.body.data.userId, 'farmer-a');
      createdPlotId = res.body.data.id;
    });

    it('User A retrieves their saved plot by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/land/records/${createdPlotId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.id, createdPlotId);
      assert.equal(res.body.data.crop, 'Teff');
    });

    it('GET /api/v1/land lists user plots (alias route)', async () => {
      const res = await request(app)
        .get('/api/v1/land')
        .set('Authorization', `Bearer ${userAToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data));
      assert.ok(res.body.data.some((p) => p.id === createdPlotId));
    });

    it('User B is blocked from retrieving User A\'s private plot (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/v1/land/records/${createdPlotId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'FORBIDDEN');
    });

    it('User B is blocked from editing User A\'s private plot (403 Forbidden)', async () => {
      const res = await request(app)
        .patch(`/api/v1/land/records/${createdPlotId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({ plotName: 'Hacked Plot Name' });

      assert.equal(res.status, 403);
      assert.equal(res.body.error.code, 'FORBIDDEN');
    });

    it('User A edits their plot to change crop to Wheat and update dimensions', async () => {
      const res = await request(app)
        .patch(`/api/v1/land/records/${createdPlotId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          plotName: 'Bishoftu South Parcel 1 - Wheat Block',
          crop: 'Wheat',
          length: 200,
          width: 100,
          lengthUnit: 'meters',
          widthUnit: 'meters',
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.plotName, 'Bishoftu South Parcel 1 - Wheat Block');
      assert.equal(res.body.data.crop, 'Wheat');
      assert.equal(res.body.data.areaSquareMeters, 20000);
      assert.equal(res.body.data.areaHectares, 2.0);
    });

    it('User B is blocked from deleting User A\'s private plot (403 Forbidden)', async () => {
      const res = await request(app)
        .delete(`/api/v1/land/records/${createdPlotId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      assert.equal(res.status, 403);
      assert.equal(res.body.error.code, 'FORBIDDEN');
    });

    it('User A deletes their plot successfully', async () => {
      const res = await request(app)
        .delete(`/api/v1/land/records/${createdPlotId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
    });

    it('Accessing deleted plot returns 404 Not Found', async () => {
      const res = await request(app)
        .get(`/api/v1/land/records/${createdPlotId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      assert.equal(res.status, 404);
      assert.equal(res.body.error.code, 'NOT_FOUND');
    });
  });

  describe('3. Farm Management & Strict Data Ownership', () => {
    let createdFarmId;

    it('User A creates a private farm record', async () => {
      const res = await request(app)
        .post('/api/v1/farms')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          name: 'Ada\'a Teff Experimental Plot',
          region: 'Oromia',
          zone: 'East Shewa',
          woreda: 'Bishoftu',
          totalHectares: 4.0,
          primaryCrop: 'White Teff (Magna)',
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.name, 'Ada\'a Teff Experimental Plot');
      assert.equal(res.body.data.userId, 'farmer-a');
      createdFarmId = res.body.data.id;
    });

    it('User A can retrieve their own farm', async () => {
      const res = await request(app)
        .get(`/api/v1/farms/${createdFarmId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.id, createdFarmId);
    });

    it('User B is blocked from viewing User A\'s private farm (403 Forbidden)', async () => {
      const res = await request(app)
        .get(`/api/v1/farms/${createdFarmId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      assert.equal(res.status, 403);
      assert.equal(res.body.success, false);
      assert.equal(res.body.error.code, 'FORBIDDEN');
    });

    it('User B is blocked from modifying User A\'s farm', async () => {
      const res = await request(app)
        .patch(`/api/v1/farms/${createdFarmId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({ name: 'Malicious Rename' });

      assert.equal(res.status, 403);
    });
  });

  describe('4. Financial Summary & Division-by-Zero Protection', () => {
    it('aggregates expenses, harvests, and computes costs and profits per hectare', async () => {
      const farmRes = await request(app)
        .post('/api/v1/farms')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          name: 'Finance Test Farm',
          region: 'Oromia',
          totalHectares: 2.5,
        });

      const farmId = farmRes.body.data.id;

      await request(app)
        .post('/api/v1/expenses')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          farmId,
          season: '2026 Test Season',
          category: 'fertilizer',
          description: 'Urea Fertilizer',
          amount: 15000,
          currency: 'ETB',
          date: '2026-06-01',
        });

      await request(app)
        .post('/api/v1/expenses')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          farmId,
          season: '2026 Test Season',
          category: 'seeds',
          description: 'Improved Seeds',
          amount: 5000,
          currency: 'ETB',
          date: '2026-06-05',
        });

      await request(app)
        .post('/api/v1/harvests')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          farmId,
          crop: 'Wheat',
          season: '2026 Test Season',
          harvestDate: '2026-10-10',
          quantity: 20,
          unit: 'Quintals',
          sellingPricePerUnit: 4000,
          currency: 'ETB',
        });

      const sumRes = await request(app)
        .get(`/api/v1/finance/summary?farmId=${farmId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      assert.equal(sumRes.status, 200);
      const data = sumRes.body.data;
      assert.equal(data.totalCost, 20000);
      assert.equal(data.costPerHectare, 8000);
      assert.equal(data.totalRevenue, 80000);
      assert.equal(data.estimatedProfit, 60000);
      assert.equal(data.profitPerHectare, 24000);
      assert.ok(data.categoryBreakdown.length > 0);
    });
  });

  describe('5. Agricultural Marketplace & Listing Ownership', () => {
    let listingId;

    it('Public can browse marketplace listings without token', async () => {
      const res = await request(app).get('/api/v1/marketplace/listings');
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.data));
    });

    it('User A creates a marketplace listing', async () => {
      const res = await request(app)
        .post('/api/v1/marketplace/listings')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          commodityName: 'White Teff',
          variety: 'Magna',
          category: 'cereals_grains',
          description: 'Premium grade Magna white teff from Bishoftu volcanic soil.',
          volumeAmount: 50,
          volumeUnit: 'Quintals',
          askingPriceAmount: 110,
          priceUnit: 'kg',
          currency: 'ETB',
          region: 'Oromia',
          zone: 'East Shewa',
          woreda: 'Bishoftu',
          contactPerson: 'Farmer A',
          contactPhone: '+251911223344',
          harvestYear: 2026,
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.data.commodityName, 'White Teff');
      listingId = res.body.data.id;
    });

    it('User B is blocked from modifying User A\'s listing (403 Forbidden)', async () => {
      const res = await request(app)
        .patch(`/api/v1/marketplace/listings/${listingId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({ askingPriceAmount: 10 });

      assert.equal(res.status, 403);
    });

    it('Public can submit an inquiry to the listing', async () => {
      const res = await request(app)
        .post(`/api/v1/marketplace/listings/${listingId}/inquiries`)
        .send({
          senderName: 'Addis Grain Wholesaler',
          senderPhone: '+251912345678',
          senderEmail: 'buyer@addisgrains.com',
          message: 'Interested in purchasing the full 50 quintals lot. Can we arrange inspection?',
          offeredPrice: 105,
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.listingId, listingId);
    });
  });

  describe('6. Crop Health Service & Telegram Bot Sync Interface', () => {
    it('GET /api/v1/crop-health/status reports honest service status and bot integration', async () => {
      const res = await request(app).get('/api/v1/crop-health/status');
      assert.equal(res.status, 200);
      assert.equal(res.body.data.botIntegrationActive, true);
      assert.equal(res.body.data.botUsername, 'gebere_vision_bot');
      assert.ok(res.body.data.notice.includes('Telegram Bot'));
    });

    it('POST /api/v1/crop-health/bot-sync rejects unauthenticated requests', async () => {
      const res = await request(app)
        .post('/api/v1/crop-health/bot-sync')
        .send({
          crop: 'Coffee',
          diseaseIdentified: 'Coffee Leaf Rust',
        });

      assert.equal(res.status, 401);
    });

    it('POST /api/v1/crop-health/bot-sync accepts sync with valid Bot API key', async () => {
      const res = await request(app)
        .post('/api/v1/crop-health/bot-sync')
        .set('X-Bot-Api-Key', config.telegramBotApiKey)
        .send({
          crop: 'Coffee',
          farmerTelegramId: 'tg-987654',
          symptoms: 'Orange powdery pustules under leaves',
          diseaseIdentified: 'Coffee Leaf Rust',
          confidence: 96,
          region: 'Sidama',
          language: 'Afaan Oromo',
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.equal(res.body.data.crop, 'Coffee');
    });
  });

  describe('7. Oromia Crop Catalogue Engine', () => {
    it('GET /api/v1/crops returns all 4 priority crops (Coffee, Teff, Wheat, Barley)', async () => {
      const res = await request(app).get('/api/v1/crops');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.count, 4);

      const cropIds = res.body.data.map((c) => c.id);
      assert.ok(cropIds.includes('coffee'));
      assert.ok(cropIds.includes('teff'));
      assert.ok(cropIds.includes('wheat'));
      assert.ok(cropIds.includes('barley'));
    });

    it('GET /api/v1/crops/coffee returns verified Coffea arabica agronomic parameters', async () => {
      const res = await request(app).get('/api/v1/crops/coffee');
      assert.equal(res.status, 200);
      assert.equal(res.body.data.scientificName, 'Coffea arabica');
      assert.equal(res.body.data.nameAfaanOromoo, 'Buna');
      assert.ok(res.body.data.varieties.length > 0);
      assert.ok(res.body.data.farmingActivities.length > 0);
    });
  });

  describe('8. All-Ethiopia Geographic Administrative Model', () => {
    it('GET /api/v1/locations/regions returns all 14 Ethiopian administrative regions and charter cities', async () => {
      const res = await request(app).get('/api/v1/locations/regions');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.count, 14);

      const regionNames = res.body.data.map((r) => r.name);
      assert.ok(regionNames.includes('Oromia'));
      assert.ok(regionNames.includes('Amhara'));
      assert.ok(regionNames.includes('Sidama'));
      assert.ok(regionNames.includes('Tigray'));
      assert.ok(regionNames.includes('Somali'));
      assert.ok(regionNames.includes('Addis Ababa Administration'));
      assert.ok(regionNames.includes('Dire Dawa Administration'));
    });

    it('GET /api/v1/locations/zones returns verified zones across Ethiopia', async () => {
      const res = await request(app).get('/api/v1/locations/zones');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(res.body.count >= 20);

      const zoneNames = res.body.data.map((z) => z.name);
      assert.ok(zoneNames.includes('Bale'));
      assert.ok(zoneNames.includes('West Arsi'));
      assert.ok(zoneNames.includes('Jimma'));
      assert.ok(zoneNames.includes('East Gojjam'));
      assert.ok(zoneNames.includes('East Shewa'));
    });

    it('GET /api/v1/locations/woredas?zone=Bale returns real woredas including Goba and Sinana', async () => {
      const res = await request(app).get('/api/v1/locations/woredas?zone=Bale');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.equal(res.body.zone, 'Bale');

      const woredaNames = res.body.data.map((w) => w.name);
      assert.ok(woredaNames.includes('Goba'));
      assert.ok(woredaNames.some((w) => w.includes('Sinana')));
    });
  });

  describe('9. Gebere Vision AI Diagnostic Engine', () => {
    it('POST /api/v1/crop-health/diagnose correctly identifies Coffee Leaf Rust and provides EIAR cultural advice', async () => {
      const res = await request(app)
        .post('/api/v1/crop-health/diagnose')
        .send({
          crop: 'Coffee',
          region: 'Oromia',
          zone: 'Jimma',
          observedSymptoms: 'Powdery yellow-orange spore pustules on the lower surface of leaves',
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      const data = res.body.data;
      assert.equal(data.crop, 'Coffee');
      assert.equal(data.diseaseName, 'Coffee Leaf Rust (CLR)');
      assert.equal(data.scientificName, 'Hemileia vastatrix');
      assert.ok(data.confidenceScore >= 90);
      assert.equal(data.severity, 'High');
      assert.ok(data.approvedManagementAdvice.length > 0);
      assert.ok(data.organicTreatments.length > 0);
      assert.ok(data.sourceAuthority.includes('EIAR'));
    });

    it('POST /api/v1/crop-health/diagnose detects Wheat Stem Rust Ug99 lineage alert', async () => {
      const res = await request(app)
        .post('/api/v1/crop-health/diagnose')
        .send({
          crop: 'Wheat',
          region: 'Oromia',
          zone: 'Bale',
          observedSymptoms: 'Brick-red elongated pustules on stems and leaf sheaths',
        });

      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      const data = res.body.data;
      assert.equal(data.diseaseName, 'Wheat Stem Rust (Ug99 Race Lineage)');
      assert.equal(data.extensionOfficeEscalationRecommended, true);
      assert.ok(data.quarantineWarning);
    });

    it('POST /api/v1/crop-health/request-expert dispatches agronomist escalation', async () => {
      const res = await request(app)
        .post('/api/v1/crop-health/request-expert')
        .send({
          crop: 'Wheat',
          disease: 'Wheat Stem Rust (Ug99 Race Lineage)',
          region: 'Oromia',
          zone: 'Bale',
          woreda: 'Sinana',
          farmerContact: '+251911223344',
          farmerName: 'Lemma Megersa',
          notes: 'High infection rate spotted in Sinana research corridor',
        });

      assert.equal(res.status, 201);
      assert.equal(res.body.success, true);
      assert.ok(res.body.data.escalationId.startsWith('ESC-'));
      assert.equal(res.body.data.crop, 'Wheat');
    });

    it('GET /api/v1/crop-health/history returns recorded diagnostic logs', async () => {
      const res = await request(app).get('/api/v1/crop-health/history');
      assert.equal(res.status, 200);
      assert.equal(res.body.success, true);
      assert.ok(Array.isArray(res.body.data));
      assert.ok(res.body.data.length >= 2);
    });
  });
});


