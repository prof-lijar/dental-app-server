import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/service/UserService";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const user = await UserService.createUser(body);
        console.log(user);
        if (!user) {
            return NextResponse.json({ error: "Failed to create user" }, { status: 400 });
        }
        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}