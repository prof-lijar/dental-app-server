import { CreateUserDto } from "@/dto/User";
import {Users, UserInfo} from "@/models/Users";
import {UserRepository} from "@/repository/UserRepository";

export class UserService{
    private static repository = new UserRepository();

    static async getUser(id: string): Promise<Users | null> {
        return await this.repository.findById(id);
    }

    //create user
    static async createUser(createUserDto: CreateUserDto): Promise<Users | null>{
        //hash password
        const hashedPassword = createUserDto.password;

        //generate access token and refresh token
        const accessToken = "sofjewpjasd;lfjoewif"
        const refreshToken = "sofjewpjasd;lfjoewif"
        //generate session id
        const sessionId = "sofjewpjasd;lfjoewif"

        //create user
        const user: Users = {
            ...createUserDto,
            password: hashedPassword,
            access_token: accessToken,
            refresh_token: refreshToken,
            session_id: sessionId,
        }; 
        return await this.repository.create(user);
    }
}