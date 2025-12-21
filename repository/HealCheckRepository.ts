import { BaseRepository } from "./base.repository";
import { HealthCheckResult, HealthCheckReport } from "@/models/DentalHealthCheckResult";

export class HealthCheckRepository extends BaseRepository<HealthCheckResult> {
    protected tableName = "health_check_result";
    protected primaryKey = "id";

    /**
     * Find latest health check result by user ID
     */
    async findLatestByUserId(userId: string): Promise<HealthCheckResult | null> {
        const query = `
            SELECT * FROM ${this.tableName} 
            WHERE user_id = $1 AND is_deleted = false 
            ORDER BY created_at DESC 
            LIMIT 1
        `;
        const result = await this.executeQuery<HealthCheckResult>(query, [userId]);
        return result.rows[0] || null;
    }

    /**
     * Find health check results by user ID with pagination
     * @returns Object containing data array and total count
     */
    async findByUserId(
        userId: string,
        page: number = 1,
        size: number = 10
    ): Promise<{ data: HealthCheckResult[]; total: number }> {
        const offset = (page - 1) * size;
        
        // Get total count
        const countQuery = `
            SELECT COUNT(*) as count FROM ${this.tableName} 
            WHERE user_id = $1 AND is_deleted = false
        `;
        const countResult = await this.executeQuery<{ count: string }>(countQuery, [userId]);
        const total = parseInt(countResult.rows[0].count, 10);

        // Get paginated data
        const dataQuery = `
            SELECT * FROM ${this.tableName} 
            WHERE user_id = $1 AND is_deleted = false 
            ORDER BY created_at DESC 
            LIMIT $2 OFFSET $3
        `;
        const dataResult = await this.executeQuery<HealthCheckResult>(dataQuery, [userId, size, offset]);

        return {
            data: dataResult.rows,
            total: total,
        };
    }
}

