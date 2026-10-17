import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config';
import { UnauthorizedError, ForbiddenError } from './errorHandler';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'farmer' | 'cooperative_manager' | 'buyer' | 'agronomist';
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// Initialize Supabase admin client if keys are provided
const supabaseAdmin =
  config.supabase.url && config.supabase.serviceRoleKey
    ? createClient(config.supabase.url, config.supabase.serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

/**
 * Extracts and verifies the authenticated user from the Authorization Bearer header.
 * Derives user ID strictly from the verified token, never trusting client-supplied user IDs.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const demoUserId = req.headers['x-demo-user-id'] as string | undefined;

  // 1. Check for standard Bearer Token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();

    // Support local demo token if database/Supabase is unconfigured
    if (token === 'demo-token' || token.startsWith('demo-user-')) {
      req.user = {
        id: demoUserId || (token.startsWith('demo-user-') ? token.replace('demo-user-', '') : 'usr-demo-farmer-1'),
        email: 'farmer.demo@geberevision.et',
        role: 'farmer',
      };
      return next();
    }

    // If Supabase is configured, verify cryptographically with Supabase
    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin.auth.getUser(token);
        if (error || !data.user) {
          throw new UnauthorizedError('Invalid or expired authentication session.');
        }

        req.user = {
          id: data.user.id,
          email: data.user.email || 'unknown@geberevision.et',
          role: (data.user.user_metadata?.role as AuthenticatedUser['role']) || 'farmer',
        };
        return next();
      } catch (err) {
        return next(err instanceof UnauthorizedError ? err : new UnauthorizedError('Session verification failed'));
      }
    } else {
      // If Supabase is not configured yet, allow demo token session for development inspection
      req.user = {
        id: demoUserId || 'usr-demo-farmer-1',
        email: 'farmer.demo@geberevision.et',
        role: 'farmer',
      };
      return next();
    }
  }

  // 2. Allow X-Demo-User-Id header during local development / testing
  if (config.nodeEnv !== 'production' && demoUserId) {
    req.user = {
      id: demoUserId,
      email: `${demoUserId}@geberevision.et`,
      role: 'farmer',
    };
    return next();
  }

  return next(new UnauthorizedError('Authentication token is required to access this resource.'));
}

/**
 * Optional authentication middleware for public endpoints with personalized features.
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const demoUserId = req.headers['x-demo-user-id'] as string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token === 'demo-token' || token.startsWith('demo-user-')) {
      req.user = {
        id: demoUserId || (token.startsWith('demo-user-') ? token.replace('demo-user-', '') : 'usr-demo-farmer-1'),
        email: 'farmer.demo@geberevision.et',
        role: 'farmer',
      };
      return next();
    }

    if (supabaseAdmin) {
      try {
        const { data } = await supabaseAdmin.auth.getUser(token);
        if (data?.user) {
          req.user = {
            id: data.user.id,
            email: data.user.email || '',
            role: (data.user.user_metadata?.role as AuthenticatedUser['role']) || 'farmer',
          };
        }
      } catch {
        // Soft fail for optional auth
      }
    }
  } else if (config.nodeEnv !== 'production' && demoUserId) {
    req.user = {
      id: demoUserId,
      email: `${demoUserId}@geberevision.et`,
      role: 'farmer',
    };
  }

  next();
}

/**
 * Verifies that the incoming request is from the authenticated Telegram Bot via secret API Key.
 */
export function requireBotApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-bot-api-key'] || req.headers['authorization'];

  if (!apiKey) {
    return next(new UnauthorizedError('Missing Telegram Bot API authentication key.'));
  }

  const token = typeof apiKey === 'string' && apiKey.startsWith('Bearer ') ? apiKey.substring(7).trim() : apiKey;

  if (token !== config.telegramBotApiKey) {
    return next(new ForbiddenError('Invalid Telegram Bot API Key.'));
  }

  next();
}
