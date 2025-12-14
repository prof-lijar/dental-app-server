import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/service/UserService";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const user_id = searchParams.get("userId");

        if (!user_id) {
            return NextResponse.json(
                { error: "user_id is required" },
                { status: 400 }
            );
        }

        const userInfo = await UserService.getUserInfoByUserId(user_id);

        if (!userInfo) {
            return NextResponse.json(
                { error: "User info not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(userInfo, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

