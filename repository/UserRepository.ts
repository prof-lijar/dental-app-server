import {Users, UserInfo} from "@/models/Users";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository<Users>{
    protected tableName = "users";
    protected primaryKey = "id";
}