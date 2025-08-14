// Vercel serverless function for subscription plans
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  integer, 
  boolean,
  decimal 
} from 'drizzle-orm/pg-core';

// Database schema for subscription plans
const subscriptionPlans = pgTable('subscription_plans', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  displayName: text('display_name').notNull(),
  description: text('description').notNull(),
  monthlyPrice: decimal('monthly_price', { precision: 10, scale: 2 }).notNull(),
  yearlyPrice: decimal('yearly_price', { precision: 10, scale: 2 }),
  features: text('features').array(),
  websiteLimit: integer('website_limit'),
  scansPerMonth: integer('scans_per_month'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

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
    // Database connection
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    const client = postgres(connectionString, { ssl: 'require' });
    const db = drizzle(client);

    if (req.method === 'GET') {
      // Get all active subscription plans
      const plans = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.isActive, true))
        .orderBy(subscriptionPlans.monthlyPrice);

      return res.status(200).setHeader('Access-Control-Allow-Origin', '*').json(plans);
    }

    if (req.method === 'POST') {
      // Create new subscription plan
      const planData = req.body;
      
      const [plan] = await db
        .insert(subscriptionPlans)
        .values({
          ...planData,
          updatedAt: new Date()
        })
        .returning();

      return res.status(201).setHeader('Access-Control-Allow-Origin', '*').json(plan);
    }

    // Method not allowed
    return res.status(405).setHeader('Access-Control-Allow-Origin', '*').json({ 
      message: 'Method not allowed' 
    });

  } catch (error) {
    console.error('Subscription plans API error:', error);
    return res.status(500).setHeader('Access-Control-Allow-Origin', '*').json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}