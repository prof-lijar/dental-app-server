// Database configuration
// Initialize database connection pool on app startup

import { initDatabasePool, closePool } from "@/utils/db";

/**
 * Initialize database connection
 * Call this when your app starts
 */
export function initializeDatabase() {
  try {
    initDatabasePool();
    console.log("Database connection pool initialized");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

/**
 * Close database connection
 * Call this when your app shuts down
 */
export async function shutdownDatabase() {
  try {
    await closePool();
    console.log("Database connection pool closed");
  } catch (error) {
    console.error("Error closing database pool:", error);
  }
}
