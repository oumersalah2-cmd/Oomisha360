import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  convertLengthToMeters,
  calculateRectangularArea,
  calculatePolygonArea,
  RECTANGULAR_DISCLAIMER,
  MAP_ESTIMATE_DISCLAIMER,
} from '../utils/land.ts';

describe('Land Area Calculator & Unit Conversions', () => {
  describe('convertLengthToMeters', () => {
    it('converts meters directly', () => {
      assert.equal(convertLengthToMeters(100, 'meters'), 100);
      assert.equal(convertLengthToMeters(1, 'meters'), 1);
    });

    it('converts kilometers to meters using 1 km = 1,000 m', () => {
      assert.equal(convertLengthToMeters(1, 'kilometers'), 1000);
      assert.equal(convertLengthToMeters(2.5, 'kilometers'), 2500);
    });

    it('converts feet to meters using 1 ft = 0.3048 m', () => {
      assert.ok(Math.abs(convertLengthToMeters(1, 'feet') - 0.3048) < 1e-4);
      assert.ok(Math.abs(convertLengthToMeters(1000, 'feet') - 304.8) < 1e-2);
    });

    it('rejects zero or negative dimensions', () => {
      assert.throws(() => convertLengthToMeters(0, 'meters'));
      assert.throws(() => convertLengthToMeters(-10, 'meters'));
      assert.throws(() => convertLengthToMeters(-0.5, 'kilometers'));
      assert.throws(() => convertLengthToMeters(-100, 'feet'));
    });

    it('rejects non-finite or invalid numbers', () => {
      assert.throws(() => convertLengthToMeters(NaN, 'meters'));
      assert.throws(() => convertLengthToMeters(Infinity, 'meters'));
    });
  });

  describe('calculateRectangularArea', () => {
    it('calculates 100m x 100m plot accurately (10,000 m² = 1 hectare)', () => {
      const result = calculateRectangularArea({
        length: 100,
        width: 100,
        lengthUnit: 'meters',
        widthUnit: 'meters',
      });

      assert.equal(result.squareMeters, 10000);
      assert.equal(result.hectares, 1);
      assert.ok(Math.abs(result.acres - 2.4711) < 0.01);
      assert.equal(result.isEstimate, false);
      assert.equal(result.disclaimer, RECTANGULAR_DISCLAIMER);
    });

    it('calculates mixed units (0.5 km length x 200 feet width)', () => {
      const result = calculateRectangularArea({
        length: 0.5,
        width: 200,
        lengthUnit: 'kilometers',
        widthUnit: 'feet',
      });

      assert.equal(result.normalizedLengthMeters, 500);
      assert.ok(Math.abs(result.normalizedWidthMeters! - 60.96) < 0.01);
      assert.ok(Math.abs(result.squareMeters - 30480) < 0.1);
      assert.ok(Math.abs(result.hectares - 3.048) < 0.01);
    });

    it('rejects invalid or negative dimensions in rectangular calculation', () => {
      assert.throws(() =>
        calculateRectangularArea({
          length: -50,
          width: 100,
          lengthUnit: 'meters',
          widthUnit: 'meters',
        })
      );

      assert.throws(() =>
        calculateRectangularArea({
          length: 50,
          width: 0,
          lengthUnit: 'meters',
          widthUnit: 'meters',
        })
      );
    });
  });

  describe('calculatePolygonArea', () => {
    it('calculates geographic polygon area for an agricultural field in Ethiopia', () => {
      const fieldCoords = [
        { lat: 8.7500, lng: 38.9800 },
        { lat: 8.7509, lng: 38.9800 },
        { lat: 8.7509, lng: 38.9809 },
        { lat: 8.7500, lng: 38.9809 },
      ];

      const result = calculatePolygonArea(fieldCoords);

      assert.ok(result.squareMeters > 5000);
      assert.ok(result.squareMeters < 15000);
      assert.ok(result.hectares > 0.5);
      assert.ok(result.acres > 1);
      assert.equal(result.isEstimate, true);
      assert.equal(result.disclaimer, MAP_ESTIMATE_DISCLAIMER);
    });

    it('rejects polygons with fewer than 3 vertices', () => {
      assert.throws(
        () =>
          calculatePolygonArea([
            { lat: 8.75, lng: 38.98 },
            { lat: 8.76, lng: 38.99 },
          ]),
        /A polygon requires at least 3 valid coordinate vertices/
      );
    });

    it('rejects invalid coordinates out of bounds', () => {
      assert.throws(
        () =>
          calculatePolygonArea([
            { lat: 100, lng: 38.98 },
            { lat: 8.76, lng: 38.99 },
            { lat: 8.75, lng: 38.98 },
          ]),
        /Coordinate out of geographic bounds/
      );
    });
  });
});
