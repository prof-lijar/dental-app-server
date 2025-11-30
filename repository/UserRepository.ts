import {Users, UserInfo} from "@/models/Users";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<Users>{
    protected tableName = "users";
    protected primaryKey = "id";

    async findByEmail(email: string): Promise<Users | null>{
        let query = `SELECT * FROM ${this.tableName} WHERE email = $1 LIMIT 1`;
        const result = await this.executeQuery<Users>(query, [email]);
        return result.rows[0] || null;
    }
}