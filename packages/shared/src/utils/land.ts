import type {
  MeasurementUnit,
  PolygonCoordinates,
  LandAreaResult,
  RectangularCalculationInput,
} from '../types/index.js';

export const METERS_PER_KILOMETER = 1000;
export const METERS_PER_FOOT = 0.3048;
export const SQUARE_METERS_PER_HECTARE = 10000;
export const SQUARE_METERS_PER_ACRE = 4046.8564224;
export const WGS84_EARTH_RADIUS_METERS = 6378137;

export const RECTANGULAR_DISCLAIMER =
  'Note: Rectangular calculations assume straight, perpendicular 90-degree corners. Real-world Ethiopian agricultural plots often have irregular terrain or meandering borders where a polygon map measurement is recommended.';

export const MAP_ESTIMATE_DISCLAIMER =
  'Notice: Map polygon calculations are mathematical estimates for agricultural planning and farm management. They do not constitute official cadastral or certified land administration surveys.';

/**
 * Converts a measurement from a given unit to meters.
 * Validates that the input is a positive finite number.
 */
export function convertLengthToMeters(value: number, unit: MeasurementUnit): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error('Measurement value must be a valid finite number.');
  }
  if (value <= 0) {
    throw new Error('Measurement value must be strictly greater than zero.');
  }

  switch (unit) {
    case 'meters':
      return value;
    case 'kilometers':
      return value * METERS_PER_KILOMETER;
    case 'feet':
      return value * METERS_PER_FOOT;
    default:
      throw new Error(`Unsupported measurement unit: ${unit}`);
  }
}

/**
 * Calculates area for a rectangular plot.
 * Normalizes length and width to meters before multiplying.
 */
export function calculateRectangularArea(input: RectangularCalculationInput): LandAreaResult {
  const { length, width, lengthUnit, widthUnit } = input;

  const normalizedLengthMeters = convertLengthToMeters(length, lengthUnit);
  const normalizedWidthMeters = convertLengthToMeters(width, widthUnit);

  const squareMeters = normalizedLengthMeters * normalizedWidthMeters;
  const hectares = squareMeters / SQUARE_METERS_PER_HECTARE;
  const acres = squareMeters / SQUARE_METERS_PER_ACRE;

  return {
    squareMeters: round(squareMeters, 4),
    hectares: round(hectares, 4),
    acres: round(acres, 4),
    normalizedLengthMeters: round(normalizedLengthMeters, 4),
    normalizedWidthMeters: round(normalizedWidthMeters, 4),
    isEstimate: false,
    disclaimer: RECTANGULAR_DISCLAIMER,
  };
}

/**
 * Calculates the surface area of a polygon defined by geographic coordinates (lat/lng)
 * using the spherical excess algorithm on the WGS84 Earth ellipsoid model.
 */
export function calculatePolygonArea(coordinates: PolygonCoordinates[]): LandAreaResult {
  if (!Array.isArray(coordinates) || coordinates.length < 3) {
    throw new Error('A polygon requires at least 3 valid coordinate vertices.');
  }

  // Validate coordinates
  for (let i = 0; i < coordinates.length; i++) {
    const pt = coordinates[i];
    if (
      typeof pt.lat !== 'number' ||
      typeof pt.lng !== 'number' ||
      !Number.isFinite(pt.lat) ||
      !Number.isFinite(pt.lng)
    ) {
      throw new Error(`Invalid coordinate vertex at index ${i}.`);
    }
    if (pt.lat < -90 || pt.lat > 90 || pt.lng < -180 || pt.lng > 180) {
      throw new Error(`Coordinate out of geographic bounds at index ${i}: [${pt.lat}, ${pt.lng}].`);
    }
  }

  // Ensure closed loop for computation
  const pts = [...coordinates];
  const first = pts[0];
  const last = pts[pts.length - 1];
  if (first.lat !== last.lat || first.lng !== last.lng) {
    pts.push(first);
  }

  let totalAngle = 0;
  const numPoints = pts.length;

  for (let i = 0; i < numPoints - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];

    const lat1Rad = toRadians(p1.lat);
    const lat2Rad = toRadians(p2.lat);
    const deltaLngRad = toRadians(p2.lng - p1.lng);

    totalAngle += (deltaLngRad) * (2 + Math.sin(lat1Rad) + Math.sin(lat2Rad));
  }

  const rawAreaMetersSquared = Math.abs((totalAngle * WGS84_EARTH_RADIUS_METERS * WGS84_EARTH_RADIUS_METERS) / 2);

  const squareMeters = rawAreaMetersSquared;
  const hectares = squareMeters / SQUARE_METERS_PER_HECTARE;
  const acres = squareMeters / SQUARE_METERS_PER_ACRE;

  return {
    squareMeters: round(squareMeters, 2),
    hectares: round(hectares, 4),
    acres: round(acres, 4),
    isEstimate: true,
    disclaimer: MAP_ESTIMATE_DISCLAIMER,
  };
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
