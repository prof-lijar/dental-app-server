import { BaseRepository } from "./base.repository";
import { HealthCheckResult, HealthCheckReport } from "@/models/DentalHealthCheckResult";

export class HealthCheckRepository extends BaseRepository<HealthCheckResult> {
    protected tableName = "health_check_result";
    protected primaryKey = "id";

    
}

