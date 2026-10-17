import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateExpenseTotal,
  calculateCostPerHectare,
  calculateRevenue,
  calculateTotalRevenue,
  calculateProfit,
  calculateProfitPerHectare,
  calculateCategoryBreakdown,
  calculateFinanceSummary,
} from '../utils/finance.ts';
import type { Expense, Harvest } from '../types/index.ts';

describe('Farm Financial & Profit Calculations', () => {
  describe('Expense Totals & Decimal Safety', () => {
    it('accurately computes sum of expenses without floating point drift', () => {
      const expenses = [
        { amount: 100.1 },
        { amount: 200.2 },
        { amount: 300.3 },
      ];
      const total = calculateExpenseTotal(expenses);
      assert.equal(total, 600.6);
    });

    it('returns 0 for empty expenses list', () => {
      assert.equal(calculateExpenseTotal([]), 0);
    });

    it('ignores invalid or negative expense amounts', () => {
      const expenses = [
        { amount: 500 },
        { amount: -200 },
        { amount: NaN },
      ];
      assert.equal(calculateExpenseTotal(expenses), 500);
    });
  });

  describe('Cost Per Hectare & Division-by-Zero Protection', () => {
    it('calculates cost per hectare correctly', () => {
      assert.equal(calculateCostPerHectare(50000, 5), 10000);
    });

    it('protects against division by zero when area is zero', () => {
      assert.equal(calculateCostPerHectare(50000, 0), 0);
    });

    it('protects against division by zero when area is negative or NaN', () => {
      assert.equal(calculateCostPerHectare(50000, -2), 0);
      assert.equal(calculateCostPerHectare(50000, NaN), 0);
    });
  });

  describe('Revenue & Profit Calculations', () => {
    it('calculates single harvest revenue (quantity * selling price)', () => {
      assert.equal(calculateRevenue(50, 6500), 325000);
    });

    it('returns 0 for non-positive quantity or price', () => {
      assert.equal(calculateRevenue(0, 100), 0);
      assert.equal(calculateRevenue(50, -10), 0);
    });

    it('aggregates multiple harvest revenues', () => {
      const harvests = [
        { quantity: 20, sellingPricePerUnit: 5000 },
        { quantity: 15, sellingPricePerUnit: 6000 },
      ];
      assert.equal(calculateTotalRevenue(harvests), 190000);
    });

    it('calculates estimated profit (revenue - totalCost)', () => {
      assert.equal(calculateProfit(190000, 80000), 110000);
    });

    it('accurately handles net loss when costs exceed revenue', () => {
      assert.equal(calculateProfit(50000, 70000), -20000);
    });

    it('calculates profit per hectare with division-by-zero protection', () => {
      assert.equal(calculateProfitPerHectare(100000, 4), 25000);
      assert.equal(calculateProfitPerHectare(100000, 0), 0);
      assert.equal(calculateProfitPerHectare(100000, -1), 0);
    });
  });

  describe('Category Breakdown & Financial Summary', () => {
    it('produces an accurate percentage breakdown across expense categories', () => {
      const expenses = [
        { category: 'seeds' as const, amount: 2000 },
        { category: 'fertilizer' as const, amount: 3000 },
        { category: 'labor' as const, amount: 5000 },
      ];

      const breakdown = calculateCategoryBreakdown(expenses);

      const labor = breakdown.find((b) => b.category === 'labor');
      const fertilizer = breakdown.find((b) => b.category === 'fertilizer');
      const seeds = breakdown.find((b) => b.category === 'seeds');

      assert.equal(labor?.amount, 5000);
      assert.equal(labor?.percentage, 50);
      assert.equal(fertilizer?.percentage, 30);
      assert.equal(seeds?.percentage, 20);
    });

    it('generates complete FinanceSummary structure with guards', () => {
      const mockExpenses: Expense[] = [
        {
          id: 'exp-1',
          userId: 'usr-1',
          farmId: 'farm-1',
          season: '2026 Meher',
          category: 'fertilizer',
          description: 'DAP fertilizer 2 bags',
          amount: 8000,
          currency: 'ETB',
          date: '2026-06-15',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'exp-2',
          userId: 'usr-1',
          farmId: 'farm-1',
          season: '2026 Meher',
          category: 'seeds',
          description: 'Certified wheat seed',
          amount: 4000,
          currency: 'ETB',
          date: '2026-06-20',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const mockHarvests: Harvest[] = [
        {
          id: 'hrv-1',
          userId: 'usr-1',
          farmId: 'farm-1',
          crop: 'Wheat',
          season: '2026 Meher',
          harvestDate: '2026-10-01',
          quantity: 25,
          unit: 'Quintals',
          sellingPricePerUnit: 4800,
          currency: 'ETB',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const summary = calculateFinanceSummary(mockExpenses, mockHarvests, 2, 'ETB', 'farm-1', '2026 Meher');

      assert.equal(summary.totalCost, 12000);
      assert.equal(summary.costPerHectare, 6000);
      assert.equal(summary.totalRevenue, 120000);
      assert.equal(summary.estimatedProfit, 108000);
      assert.equal(summary.profitPerHectare, 54000);
      assert.equal(summary.currency, 'ETB');
      assert.equal(summary.expenseCount, 2);
      assert.equal(summary.harvestCount, 1);
    });
  });
});
