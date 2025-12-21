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
}

