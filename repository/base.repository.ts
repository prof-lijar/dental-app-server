// Base Repository - Similar to Spring Boot Repository pattern
// Provides common database operations

import { PoolClient, QueryResult, QueryResultRow } from "pg";
import { getPool, executeQuery, executeTransaction } from "@/utils/db";

export abstract class BaseRepository<T extends QueryResultRow> {
  protected abstract tableName: string;
  protected abstract primaryKey: string;

  /**
   * Find entity by ID
   */
  async findById(id: string | number): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = $1`;
    const result = await executeQuery<T>(query, [id]);
    return result.rows[0] || null;
  }

  /**
   * Find all entities
   */
  async findAll(): Promise<T[]> {
    const query = `SELECT * FROM ${this.tableName} ORDER BY created_at DESC`;
    const result = await executeQuery<T>(query);
    return result.rows;
  }

  /**
   * Find all entities
   */
  async findAllASC(): Promise<T[]> {
    const query = `SELECT * FROM ${this.tableName} ORDER BY created_at ASC`;
    const result = await executeQuery<T>(query);
    return result.rows;
  }

  /**
   * Find entities with conditions
   */
  async findBy(
    conditions: Record<string, any>,
    limit?: number,
    offset?: number
  ): Promise<T[]> {
    const keys = Object.keys(conditions);
    const values = Object.values(conditions);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(" AND ");

    let query = `SELECT * FROM ${this.tableName} WHERE ${placeholders}`;
    const params = [...values];

    if (limit) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(limit);
    }

    if (offset) {
      query += ` OFFSET $${params.length + 1}`;
      params.push(offset);
    }

    const result = await executeQuery<T>(query, params);
    return result.rows;
  }

  /**
   * Find one entity with conditions
   */
  async findOne(conditions: Record<string, any>): Promise<T | null> {
    const results = await this.findBy(conditions, 1);
    return results[0] || null;
  }

  /**
   * Create new entity
   */
  async create(data: Partial<T>): Promise<T> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ");
    const columns = keys.join(", ");

    const query = `
      INSERT INTO ${this.tableName} (${columns})
      VALUES (${placeholders})
      RETURNING *
    `;

    const result = await executeQuery<T>(query, values);
    return result.rows[0];
  }

  /**
   * Update entity by ID
   */
  async update(id: string | number, data: Partial<T>): Promise<T | null> {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}, updated_at = NOW()
      WHERE ${this.primaryKey} = $${values.length + 1}
      RETURNING *
    `;

    const result = await executeQuery<T>(query, [...values, id]);
    return result.rows[0] || null;
  }

  /**
   * Delete entity by ID
   */
  async delete(id: string | number): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = $1`;
    const result = await executeQuery(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  /**
   * Count entities
   */
  async count(conditions?: Record<string, any>): Promise<number> {
    let query = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    let params: any[] = [];

    if (conditions && Object.keys(conditions).length > 0) {
      const keys = Object.keys(conditions);
      const values = Object.values(conditions);
      const placeholders = keys
        .map((_, index) => `$${index + 1}`)
        .join(" AND ");
      query += ` WHERE ${placeholders}`;
      params = values;
    }

    const result = await executeQuery<{ count: string }>(query, params);
    return parseInt(result.rows[0].count, 10);
  }

  /**
   * Execute custom query
   * Use this for complex queries that don't fit the standard CRUD operations
   */
  async executeQuery<R extends QueryResultRow = any>(
    query: string,
    params?: any[]
  ): Promise<QueryResult<R>> {
    return executeQuery<R>(query, params);
  }

  /**
   * Execute transaction
   */
  async executeTransaction<R>(
    callback: (client: PoolClient) => Promise<R>
  ): Promise<R> {
    return executeTransaction(callback);
  }
}
