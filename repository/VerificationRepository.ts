import {BaseRepository} from "@/repository/base.repository";
import {VerificationCode} from "@/models/VerificationCode";

export class VerificationRepository extends BaseRepository<VerificationCode>{
    protected tableName = "verification_codes";
    protected primaryKey = "id";

    async findByEmailAndCode(email: string, code: string): Promise<VerificationCode | null>{
        let query = `SELECT * FROM ${this.tableName} WHERE email = $1 AND code = $2 LIMIT 1`;
        const result = await this.executeQuery<VerificationCode>(query, [email, code]);
        return result.rows[0] || null;
    }
}