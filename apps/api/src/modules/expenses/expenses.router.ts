import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validateBody } from '../../middleware/validate';
import { ExpenseCreateSchema, ExpenseUpdateSchema, Expense } from '@gebere/shared';
import { inMemoryStore, isUsingPrisma, prisma } from '../../lib/db';
import { NotFoundError, ForbiddenError } from '../../middleware/errorHandler';

export const expensesRouter = Router();

// GET /api/v1/expenses
expensesRouter.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { farmId, season } = req.query;

    if (isUsingPrisma && prisma) {
      const expenses = await prisma.expense.findMany({
        where: {
          userId,
          ...(farmId ? { farmId: String(farmId) } : {}),
          ...(season ? { season: String(season) } : {}),
        },
        orderBy: { date: 'desc' },
      });
      res.json({ success: true, data: expenses });
      return;
    }

    const expenses = Array.from(inMemoryStore.expenses.values()).filter(
      (e) =>
        e.userId === userId &&
        (!farmId || e.farmId === farmId) &&
        (!season || e.season === season)
    );

    res.json({ success: true, data: expenses });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/expenses
expensesRouter.post(
  '/',
  requireAuth,
  validateBody(ExpenseCreateSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.id;
      const data = req.body;

      // Verify that the farm belongs to the user
      if (isUsingPrisma && prisma) {
        const farm = await prisma.farm.findUnique({ where: { id: data.farmId } });
        if (!farm || farm.userId !== userId) {
          throw new ForbiddenError('Farm not found or you do not have permission to log expenses on it.');
        }

        const created = await prisma.expense.create({
          data: {
            ...data,
            userId,
            date: new Date(data.date),
          },
        });
        res.status(201).json({ success: true, data: created });
        return;
      }

      const farm = inMemoryStore.farms.get(data.farmId);
      if (!farm || farm.userId !== userId) {
        throw new ForbiddenError('Farm not found or you do not have permission to log expenses on it.');
      }

      const id = `exp-${Date.now()}`;
      const now = new Date().toISOString();
      const newExpense: Expense = {
        id,
        userId,
        farmId: data.farmId,
        season: data.season,
        category: data.category,
        description: data.description,
        amount: data.amount,
        currency: data.currency || 'ETB',
        date: data.date,
        receiptUrl: data.receiptUrl || null,
        createdAt: now,
        updatedAt: now,
      };

      inMemoryStore.expenses.set(id, newExpense);
      res.status(201).json({ success: true, data: newExpense });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/v1/expenses/:id
expensesRouter.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    if (isUsingPrisma && prisma) {
      const existing = await prisma.expense.findUnique({ where: { id } });
      if (!existing) throw new NotFoundError('Expense record not found');
      if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to delete this expense.');

      await prisma.expense.delete({ where: { id } });
      res.json({ success: true, message: 'Expense deleted successfully' });
      return;
    }

    const existing = inMemoryStore.expenses.get(id);
    if (!existing) throw new NotFoundError('Expense record not found');
    if (existing.userId !== userId) throw new ForbiddenError('You do not have permission to delete this expense.');

    inMemoryStore.expenses.delete(id);
    res.json({ success: true, message: 'Expense deleted successfully' });
  } catch (err) {
    next(err);
  }
});
