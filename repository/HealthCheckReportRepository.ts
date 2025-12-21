import { BaseRepository } from "./base.repository";
import { HealthCheckReport } from "@/models/DentalHealthCheckResult";

export class HealthCheckReportRepository extends BaseRepository<HealthCheckReport> {
    protected tableName = "health_check_report";
    protected primaryKey = "id";
}

