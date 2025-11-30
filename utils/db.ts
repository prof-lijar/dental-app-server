// Database connection pool utility
// Manages PostgreSQL connection pool for Supabase

import { Pool, PoolClient, QueryResult, QueryResultRow } from "pg";

// Database connection pool
let pool: Pool | null = null;

/**
 * Initialize database connection pool
 */
export function initDatabasePool(): Pool {
  if (pool) {
    return pool;
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  pool = new Pool({
    connectionString,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
  });

  // Handle pool errors
  pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
  });

  return pool;
}

/**
 * Get database connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    return initDatabasePool();
  }
  return pool;
}

/**
 * Execute a query with automatic connection management
 * Opens connection, executes query, and closes connection
 */
export async function executeQuery<T extends QueryResultRow = any>(
  query: string,
  params?: any[]
): Promise<QueryResult<T>> {
  const pool = getPool();
  const client: PoolClient = await pool.connect();

  try {
    const result = await client.query<T>(query, params);
    return result;
  } finally {
    client.release(); // Release the client back to the pool
  }
}

/**
 * Execute a transaction
 * Opens connection, executes multiple queries in a transaction, and closes connection
 */
export async function executeTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const client: PoolClient = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Close the database connection pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
