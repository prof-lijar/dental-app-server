import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/service/AuthService";


export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        if (!body.email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }
        await AuthService.sendVerificationEmail(body.email);
        return NextResponse.json({ message: "Verification email sent" }, { status: 200 });
    } catch (error) {   
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}