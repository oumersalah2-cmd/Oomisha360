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

const configuredAuthKey =
  config.supabase.serviceRoleKey &&
  config.supabase.serviceRoleKey !== 'your-supabase-service-role-key' &&
  !config.supabase.serviceRoleKey.includes('placeholder')
    ? config.supabase.serviceRoleKey
    : config.supabase.anonKey &&
      config.supabase.anonKey !== 'your-supabase-anon-key' &&
      !config.supabase.anonKey.includes('placeholder')
    ? config.supabase.anonKey
    : '';

// Check whether real Supabase Auth keys are configured
export const isSupabaseAuthConfigured = Boolean(
  config.supabase.url && configuredAuthKey
);

// Initialize Supabase admin/verification client if keys are valid
export const supabaseAdmin = isSupabaseAuthConfigured
  ? createClient(config.supabase.url, configuredAuthKey, {
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

  // 1. Strict Production Enforcement: Reject all demo tokens and demo headers
  if (config.isProduction) {
    if (demoUserId) {
      return next(new UnauthorizedError('Demo authentication headers are strictly prohibited in production.'));
    }
    if (authHeader) {
      const token = authHeader.replace(/^Bearer\s+/i, '').trim();
      if (token === 'demo-token' || token.startsWith('demo-user-')) {
        return next(new UnauthorizedError('Demo authentication tokens are strictly prohibited in production.'));
      }
    }
    if (!isSupabaseAuthConfigured || !supabaseAdmin) {
      return next(
        new UnauthorizedError('Authentication service is misconfigured or unavailable in production.')
      );
    }
  }

  // 2. Check for Bearer Token
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();

    // In development/test mode, allow explicitly tagged demo tokens
    if (!config.isProduction && (token === 'demo-token' || token.startsWith('demo-user-'))) {
      const id = demoUserId || (token.startsWith('demo-user-') ? token.replace('demo-user-', '') : 'usr-demo-farmer-1');
      req.user = {
        id,
        email: id === 'usr-demo-farmer-1' ? 'farmer.demo@geberevision.et' : `${id}@geberevision.et`,
        role: 'farmer',
      };
      return next();
    }

    // Verify token with real Supabase Auth GoTrue service
    if (supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin.auth.getUser(token);
        if (error || !data.user) {
          return next(new UnauthorizedError(error?.message || 'Invalid or expired authentication session.'));
        }

        req.user = {
          id: data.user.id,
          email: data.user.email || 'unknown@geberevision.et',
          role: (data.user.user_metadata?.role as AuthenticatedUser['role']) || 'farmer',
        };
        return next();
      } catch (err: any) {
        return next(
          err instanceof UnauthorizedError ? err : new UnauthorizedError('Session token verification failed.')
        );
      }
    }

    // If Supabase is unconfigured and token is not a recognized demo token, fail securely
    return next(new UnauthorizedError('Invalid authentication token.'));
  }

  // 3. In development/testing, check x-demo-user-id if no Authorization header provided
  if (!config.isProduction && demoUserId) {
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

    if (!config.isProduction && (token === 'demo-token' || token.startsWith('demo-user-'))) {
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
  } else if (!config.isProduction && demoUserId) {
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
