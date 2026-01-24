import { NextRequest, NextResponse } from "next/server";
import { validateJWTToken } from "@/utils/common";
import { UserService } from "@/service/UserService";

export async function POST(request: NextRequest) {
    try {
        const authUser = await validateJWTToken(request.headers.get("Authorization")?.split(" ")[1] || "");
        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        if (!body.username || !body.pwd) {
            return NextResponse.json(
                { error: "username and pwd are required" },
                { status: 400 }
            );
        }

        const result = await UserService.createChildAccount(authUser.userId, body.username, body.pwd);
        if (!result.success) {
            return NextResponse.json({ error: result.message, code: result.code }, { status: result.code });
        }

        return NextResponse.json(result, { status: result.code });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
