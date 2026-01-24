import { NextRequest, NextResponse } from "next/server";
import { DentistService } from "@/service/DentistService";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png"]);

export async function POST(request: NextRequest) {
  try {
    const languageParam =
      request.nextUrl.searchParams.get("lang") ||
      request.nextUrl.searchParams.get("lan");
    const languageHint =
      languageParam && languageParam.trim().length > 0
        ? languageParam.trim()
        : undefined;
    const formData = await request.formData();
    const image = formData.get("image");

    if (!image || !(image instanceof File)) {
      return NextResponse.json({ error: "image is required" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(image.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG and PNG are allowed." },
        { status: 400 }
      );
    }

    if (image.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit." },
        { status: 400 }
      );
    }

    const arrayBuffer = await image.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const result = await DentistService.analyzeImage(
      base64Data,
      image.type,
      languageHint
    );

    return NextResponse.json(result);
  } catch (error: any) {
    const message = error?.message || "Internal server error";

    if (message === "Invalid JSON response") {
      return NextResponse.json(
        { error: "Invalid response from AI model" },
        { status: 500 }
      );
    }

    if (message === "Gemini request failed" || message === "Empty response from Gemini") {
      return NextResponse.json(
        { error: "Gemini request failed" },
        { status: 500 }
      );
    }

    console.error("Dental analyze API error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
