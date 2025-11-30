import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/service/AuthService";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.email || !body.password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }
        const result = await AuthService.login(body.email, body.password);
        if (!result.success) {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }

        // Extract refresh token to set as secure cookie
        const refreshToken = result.user!.refreshToken;
        
        // Remove refreshToken from response body (it will be sent via cookie only)
        const { refreshToken: _, ...userWithoutRefreshToken } = result.user!;
        
        const response = NextResponse.json({
            success: result.success,
            message: result.message,
            user: userWithoutRefreshToken
        }, { status: 200 });

        // Set refresh token as secure HTTP-only cookie
        response.cookies.set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}