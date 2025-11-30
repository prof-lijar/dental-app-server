import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/service/AuthService";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.email || !body.code || !body.type) {
            return NextResponse.json({ error: "Email, code and type are required" }, { status: 400 });
        }
        const result = await AuthService.verifyVerificationCode(body.email, body.code, body.type);
        if (!result.success) {
            return NextResponse.json({ error: result.message }, { status: 400 });
        }
        return NextResponse.json(result, { status: 200 });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}