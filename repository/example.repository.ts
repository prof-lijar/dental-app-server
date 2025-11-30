// Example Repository - Demonstrates repository pattern
// Replace with your actual repositories

import { BaseRepository } from "./base.repository";
import { ExampleModel } from "@/models";

export class ExampleRepository extends BaseRepository<ExampleModel> {
  protected tableName = "examples"; // Replace with your actual table name
  protected primaryKey = "id";

  /**
   * Custom query example
   * You can add custom methods here for specific queries
   */
  async findByName(name: string): Promise<ExampleModel | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE name = $1 LIMIT 1`;
    const result = await this.executeQuery<ExampleModel>(query, [name]);
    return result.rows[0] || null;
  }

  /**
   * Example of a complex query
   */
  async findWithPagination(
    page: number = 1,
    pageSize: number = 10
  ): Promise<{
    data: ExampleModel[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const offset = (page - 1) * pageSize;
    const data = await this.findBy({}, pageSize, offset);
    const total = await this.count();

    return {
      data,
      total,
      page,
      pageSize,
    };
  }
}
