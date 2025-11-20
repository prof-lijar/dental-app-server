// Controllers - Business logic layer
// Handle business logic and prepare data for API responses

import { ExampleModel } from "@/models";
import { ExampleRepository } from "@/repositories/example.repository";

export class ExampleController {
  private static repository = new ExampleRepository();

  /**
   * Get example by ID
   */
  static async getExample(id: string): Promise<ExampleModel | null> {
    return await this.repository.findById(id);
  }

  /**
   * Get all examples
   */
  static async getAllExamples(): Promise<ExampleModel[]> {
    return await this.repository.findAll();
  }

  /**
   * Create new example
   */
  static async createExample(
    data: Omit<ExampleModel, "id" | "createdAt" | "updatedAt">
  ): Promise<ExampleModel> {
    return await this.repository.create(data as Partial<ExampleModel>);
  }

  /**
   * Update example
   */
  static async updateExample(
    id: string,
    data: Partial<ExampleModel>
  ): Promise<ExampleModel | null> {
    return await this.repository.update(id, data);
  }

  /**
   * Delete example
   */
  static async deleteExample(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }

  /**
   * Find example by name (custom repository method example)
   */
  static async findByName(name: string): Promise<ExampleModel | null> {
    return await this.repository.findByName(name);
  }

  /**
   * Get examples with pagination
   */
  static async getExamplesWithPagination(
    page: number = 1,
    pageSize: number = 10
  ) {
    return await this.repository.findWithPagination(page, pageSize);
  }
}
