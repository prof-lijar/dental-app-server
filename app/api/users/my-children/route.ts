import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/service/UserService";
import { validateJWTToken } from "@/utils/common";

// GET /api/users/my-children
export async function GET(request: NextRequest) {
    try {
        // Validate JWT token
        const authUser = await validateJWTToken(request.headers.get("Authorization")?.split(" ")[1] || "");
        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get children for the authenticated parent
        const children = await UserService.getMyChildren(authUser.userId);

        // Return the children list
        return NextResponse.json(
            {
                success: true,
                children: children
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Get my children error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
