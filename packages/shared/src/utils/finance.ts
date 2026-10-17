import type {
  Currency,
  Expense,
  ExpenseCategory,
  FinanceSummary,
  Harvest,
  CategoryBreakdownItem,
} from '../types/index.js';

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  land_preparation: 'Land Preparation',
  seeds: 'Seeds & Seedlings',
  fertilizer: 'Fertilizer & Soil Nutrition',
  crop_protection: 'Crop Protection & Pesticides',
  labor: 'Labor & Field Hands',
  irrigation: 'Irrigation & Water',
  equipment_rental: 'Equipment & Machinery Rental',
  transportation: 'Transportation & Logistics',
  other: 'Other Operational Costs',
};

/**
 * Rounds a monetary number to 2 decimal places in a floating-point safe manner.
 */
export function roundCurrency(amount: number): number {
  if (!Number.isFinite(amount)) return 0;
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Computes sum of expenses using scaled integer cents arithmetic to avoid float drift.
 */
export function calculateExpenseTotal(expenses: Array<{ amount: number }>): number {
  if (!Array.isArray(expenses) || expenses.length === 0) {
    return 0;
  }

  let totalCents = 0;
  for (const exp of expenses) {
    if (typeof exp.amount === 'number' && Number.isFinite(exp.amount) && exp.amount > 0) {
      totalCents += Math.round(exp.amount * 100);
    }
  }

  return totalCents / 100;
}

/**
 * Calculates cost per hectare with division-by-zero protection.
 */
export function calculateCostPerHectare(totalCost: number, areaHectares: number): number {
  if (!Number.isFinite(totalCost) || !Number.isFinite(areaHectares) || areaHectares <= 0) {
    return 0;
  }
  return roundCurrency(totalCost / areaHectares);
}

/**
 * Calculates single harvest or aggregated harvest revenue.
 */
export function calculateRevenue(quantity: number, pricePerUnit: number): number {
  if (
    !Number.isFinite(quantity) ||
    !Number.isFinite(pricePerUnit) ||
    quantity <= 0 ||
    pricePerUnit <= 0
  ) {
    return 0;
  }

  const quantityCents = Math.round(quantity * 100);
  const priceCents = Math.round(pricePerUnit * 100);

  return roundCurrency((quantityCents * priceCents) / 10000);
}

/**
 * Aggregates revenue across multiple harvests.
 */
export function calculateTotalRevenue(
  harvests: Array<{ quantity: number; sellingPricePerUnit: number }>
): number {
  if (!Array.isArray(harvests) || harvests.length === 0) {
    return 0;
  }

  let total = 0;
  for (const h of harvests) {
    total += calculateRevenue(h.quantity, h.sellingPricePerUnit);
  }

  return roundCurrency(total);
}

/**
 * Calculates estimated profit: Revenue - Total Cost.
 */
export function calculateProfit(revenue: number, totalCost: number): number {
  const safeRev = Number.isFinite(revenue) ? revenue : 0;
  const safeCost = Number.isFinite(totalCost) ? totalCost : 0;
  return roundCurrency(safeRev - safeCost);
}

/**
 * Calculates profit per hectare with division-by-zero protection.
 */
export function calculateProfitPerHectare(profit: number, areaHectares: number): number {
  if (!Number.isFinite(profit) || !Number.isFinite(areaHectares) || areaHectares <= 0) {
    return 0;
  }
  return roundCurrency(profit / areaHectares);
}

/**
 * Generates an aggregated breakdown by expense category with percentages.
 */
export function calculateCategoryBreakdown(
  expenses: Array<{ category: ExpenseCategory; amount: number }>
): CategoryBreakdownItem[] {
  const categoryTotals: Record<ExpenseCategory, number> = {
    land_preparation: 0,
    seeds: 0,
    fertilizer: 0,
    crop_protection: 0,
    labor: 0,
    irrigation: 0,
    equipment_rental: 0,
    transportation: 0,
    other: 0,
  };

  let grandTotal = 0;

  for (const exp of expenses) {
    if (typeof exp.amount === 'number' && Number.isFinite(exp.amount) && exp.amount > 0) {
      if (categoryTotals[exp.category] !== undefined) {
        categoryTotals[exp.category] += exp.amount;
      } else {
        categoryTotals.other += exp.amount;
      }
      grandTotal += exp.amount;
    }
  }

  const result: CategoryBreakdownItem[] = [];

  for (const [catKey, amount] of Object.entries(categoryTotals) as [ExpenseCategory, number][]) {
    const percentage = grandTotal > 0 ? roundCurrency((amount / grandTotal) * 100) : 0;
    result.push({
      category: catKey,
      label: EXPENSE_CATEGORY_LABELS[catKey],
      amount: roundCurrency(amount),
      percentage,
    });
  }

  return result.sort((a, b) => b.amount - a.amount);
}

/**
 * Calculates a complete financial summary for a farm or season.
 */
export function calculateFinanceSummary(
  expenses: Expense[],
  harvests: Harvest[],
  cultivatedAreaHectares: number,
  currency: Currency = 'ETB',
  farmId?: string,
  season?: string
): FinanceSummary {
  const totalCost = calculateExpenseTotal(expenses);
  const totalRevenue = calculateTotalRevenue(harvests);
  const estimatedProfit = calculateProfit(totalRevenue, totalCost);
  const costPerHectare = calculateCostPerHectare(totalCost, cultivatedAreaHectares);
  const profitPerHectare = calculateProfitPerHectare(estimatedProfit, cultivatedAreaHectares);
  const categoryBreakdown = calculateCategoryBreakdown(expenses);

  return {
    farmId,
    season,
    cultivatedAreaHectares: Number.isFinite(cultivatedAreaHectares) && cultivatedAreaHectares > 0 ? roundCurrency(cultivatedAreaHectares) : 0,
    totalCost,
    costPerHectare,
    totalRevenue,
    estimatedProfit,
    profitPerHectare,
    currency,
    expenseCount: expenses.length,
    harvestCount: harvests.length,
    categoryBreakdown,
  };
}
