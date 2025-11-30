import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/service/UserService";
import { CreateUserDto } from "@/dto/User";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.username || !body.email || !body.password) {
            return NextResponse.json({ error: "Username, email and password are required" }, { status: 400 });
        }
        const createUserDto: CreateUserDto = {
            username: body.username,
            email: body.email,
            password: body.password,
        };
        const result = await UserService.createUser(createUserDto);
        if (!result.success) {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}