import { ReportType } from "@/dto/Enum";
export interface HealthCheckResult {
    id?: number;
    user_id: string;
    result: string;
    my_status?: string;
    health_score?: number;
    is_deleted: boolean;
    deleted_at?: Date;
    created_at: Date;
    updated_at: Date;
}

export interface HealthCheckReport {
    id?: number;
    check_result_id: number;
    report: string;
    report_type: ReportType;
    created_at: Date;
    updated_at: Date;
    is_deleted: boolean;
    deleted_at?: Date;
}

