import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

// Import Firestore utils
import { db } from "../../lib/config"; // adjust path as needed!
import { doc, deleteDoc } from "firebase/firestore";

export async function DELETE(req: NextRequest) {
  try {
    const { id, customFilename } = await req.json();

    // 1. Delete from Firestore
    if (id) {
      await deleteDoc(doc(db, "locations", id));
    }

    // 2. Delete file
    if (customFilename) {
      const filePath = path.join(
        process.cwd(),
        "public/uploads",
        customFilename
      );
      try {
        await fs.unlink(filePath);
      } catch (err: any) {
        if (err.code !== "ENOENT") throw err; // ignore if already deleted
      }
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
