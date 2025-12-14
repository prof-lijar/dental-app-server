import { CreateUserDto, UpdateUserInfoDto } from "@/dto/User";
import {Users, UserInfo} from "@/models/Users";
import {UserRepository} from "@/repository/UserRepository";
import { generatePasswordHash, isPasswordStrong } from "@/utils/common";

export class UserService{
    private static repository = new UserRepository();

    static async getUser(id: string): Promise<Users | null> {
        return await this.repository.findById(id);
    }

    //create user
    static async createUser(createUserDto: CreateUserDto): Promise<{ success: boolean; message: string; user: Users | null }>{

        //TODO: check if email is verified

        //check if user already exists
        const existingUser = await this.repository.findByEmail(createUserDto.email);
        if (existingUser) {
            return { success: false, message: "User already exists", user: null};
        }

        //check if username already exists
        const existingUsername = await this.repository.findByUsername(createUserDto.username);
        if (existingUsername) {
            return { success: false, message: "Username already taken", user: null};
        }

        //check if password is strong
        if (!isPasswordStrong(createUserDto.password)) {
            return { success: false, message: "Password must be at least 8 characters long and contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character", user: null};
        }

        //hash password
        const hashedPassword = generatePasswordHash(createUserDto.password);

        //create user
        const user: Users = {
            ...createUserDto,
            password: hashedPassword,
        }; 
        const newUser = await this.repository.create(user);

        //create user info
        const userInfo: UserInfo = {
            user_id: newUser.id ?? "",
            name: newUser.username,
            age: createUserDto.age,
            gender: createUserDto.gender,
            nationality: createUserDto.nationality,
        };
        await this.repository.createUserInfo(userInfo);

        return { success: true, message: "User created successfully", user: newUser };
    }

    //get user info by user id
    static async getUserInfoByUserId(user_id: string): Promise<UserInfo | null> {
        return await this.repository.getUserInfoByUserId(user_id);
    }

    //update user info
    static async updateUserInfo(updateUserInfoDto: UpdateUserInfoDto): Promise<{ success: boolean; message: string; userInfo: UserInfo | null }>{
        const userInfo = await this.repository.updateUserInfo(updateUserInfoDto);
        if (!userInfo) {
            return { success: false, message: "Failed to update user info", userInfo: null };
        }
        return { success: true, message: "User info updated successfully", userInfo: userInfo };
    }


}