import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/service/UserService";
import { UpdateUserInfoDto } from "@/dto/User";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // Validate required fields
        if (!body.user_id) {
            return NextResponse.json(
                { error: "user_id is required" },
                { status: 400 }
            );
        }

        const updateUserInfoDto: UpdateUserInfoDto = {
            user_id: body.user_id,
            name: body.name,
            age: body.age,
            gender: body.gender,
            nationality: body.nationality,
        };

        const result = await UserService.updateUserInfo(updateUserInfoDto);
        
        if (!result.success) {
            return NextResponse.json(
                { error: result.message },
                { status: 400 }
            );
        }

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

