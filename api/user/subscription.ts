// Vercel serverless function for user subscription management
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  varchar
} from 'drizzle-orm/pg-core';

// Database schema for users
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  subscriptionPlan: text('subscription_plan').default('free'),
  subscriptionStatus: text('subscription_status').default('active'),
  subscriptionEndsAt: timestamp('subscription_ends_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-in-production-32chars';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function authenticateToken(authHeader: string | undefined): Promise<{ id: number; email: string }> {
  return new Promise((resolve, reject) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      reject(new Error('No token provided'));
      return;
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      resolve(decoded);
    } catch (error) {
      reject(new Error('Invalid token'));
    }
  });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      .end();
  }

  try {
    // Authenticate user
    const user = await authenticateToken(req.headers.authorization);
    
    // Database connection
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const client = postgres(connectionString, { ssl: 'require' });
    const db = drizzle(client);

    if (req.method === 'GET') {
      // Get user subscription details
      const [userData] = await db
        .select({
          subscriptionPlan: users.subscriptionPlan,
          subscriptionStatus: users.subscriptionStatus,
          subscriptionEndsAt: users.subscriptionEndsAt
        })
        .from(users)
        .where(eq(users.id, user.id));

      if (!userData) {
        return res.status(404).setHeader('Access-Control-Allow-Origin', '*').json({ 
          message: 'User not found' 
        });
      }

      return res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({
        subscriptionPlan: userData.subscriptionPlan || 'free',
        subscriptionStatus: userData.subscriptionStatus || 'active',
        subscriptionEndsAt: userData.subscriptionEndsAt || null
      });
    }

    if (req.method === 'PUT') {
      // Update user subscription
      const { subscriptionPlan, subscriptionStatus, subscriptionEndsAt } = req.body;

      const [updatedUser] = await db
        .update(users)
        .set({
          subscriptionPlan,
          subscriptionStatus,
          subscriptionEndsAt: subscriptionEndsAt ? new Date(subscriptionEndsAt) : null,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id))
        .returning({
          subscriptionPlan: users.subscriptionPlan,
          subscriptionStatus: users.subscriptionStatus,
          subscriptionEndsAt: users.subscriptionEndsAt
        });

      return res.status(200).setHeader('Access-Control-Allow-Origin', '*').json(updatedUser);
    }

    // Method not allowed
    return res.status(405).setHeader('Access-Control-Allow-Origin', '*').json({ 
      message: 'Method not allowed' 
    });

  } catch (error) {
    console.error('User subscription API error:', error);
    
    if (error instanceof Error && error.message.includes('token')) {
      return res.status(401).setHeader('Access-Control-Allow-Origin', '*').json({ 
        message: 'Unauthorized' 
      });
    }

    return res.status(500).setHeader('Access-Control-Allow-Origin', '*').json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}