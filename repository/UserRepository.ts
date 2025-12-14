import {Users, UserInfo} from "@/models/Users";
import { BaseRepository } from "./base.repository";
import { UpdateUserInfoDto } from "@/dto/User";

export class UserRepository extends BaseRepository<Users>{
    protected tableName = "users";
    protected primaryKey = "id";

    async findByEmail(email: string): Promise<Users | null>{
        let query = `SELECT * FROM ${this.tableName} WHERE email = $1 LIMIT 1`;
        const result = await this.executeQuery<Users>(query, [email]);
        return result.rows[0] || null;
    }

    async findByUsername(username: string): Promise<Users | null>{
        let query = `SELECT * FROM ${this.tableName} WHERE username = $1 LIMIT 1`;
        const result = await this.executeQuery<Users>(query, [username]);
        return result.rows[0] || null;
    }

    //create user info
    async createUserInfo(userInfo: UserInfo): Promise<UserInfo> {
        let query = `INSERT INTO user_info(user_id, name, age, gender, nationality) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const result = await this.executeQuery<UserInfo>(query,
            [
                userInfo.user_id,
                userInfo.name,
                userInfo.age,
                userInfo.gender,
                userInfo.nationality,
            ]
            );
        return result.rows[0];
    }

    //get user info by user id
    async getUserInfoByUserId(user_id: string): Promise<UserInfo | null> {
        let query = `SELECT * FROM user_info WHERE user_id = $1 LIMIT 1`;
        const result = await this.executeQuery<UserInfo>(query, [user_id]);
        return result.rows[0] || null;
    }

    //update user info
    async updateUserInfo(updateUserInfoDto: UpdateUserInfoDto): Promise<UserInfo | null> {
        const { id, user_id, name, age, gender, nationality } = updateUserInfoDto;
        let query = `UPDATE user_info SET name = $1, age = $2, gender = $3, nationality = $4 WHERE user_id = $5 RETURNING *`;
        const result = await this.executeQuery<UserInfo>(query, [name, age, gender, nationality, user_id]);
        return result.rows[0] || null;
    }
    
}