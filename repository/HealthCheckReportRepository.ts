import { BaseRepository } from "./base.repository";
import { HealthCheckReport } from "@/models/DentalHealthCheckResult";

export class HealthCheckReportRepository extends BaseRepository<HealthCheckReport> {
    protected tableName = "health_check_report";
    protected primaryKey = "id";

    /**
     * Find all reports by check_result_id that are not deleted
     */
    async findByCheckResultId(checkResultId: number): Promise<HealthCheckReport[]> {
        const query = `
            SELECT * FROM ${this.tableName} 
            WHERE check_result_id = $1 AND is_deleted = false
            ORDER BY created_at ASC
        `;
        const result = await this.executeQuery<HealthCheckReport>(query, [checkResultId]);
        return result.rows;
    }
}

