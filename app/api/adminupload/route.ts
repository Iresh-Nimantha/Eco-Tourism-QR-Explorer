import { writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

// Helper: Simple filename sanitizer
function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    let customFilename = formData.get("customFilename") as string | null;

    if (!file || !customFilename) {
      return NextResponse.json(
        { error: "No file or filename" },
        { status: 400 }
      );
    }

    customFilename = sanitizeFilename(customFilename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the uploads directory exists
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save with the custom filename
    const savePath = path.join(uploadDir, customFilename);
    await writeFile(savePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${customFilename}`,
    });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
