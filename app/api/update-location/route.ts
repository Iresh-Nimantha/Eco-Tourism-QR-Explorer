import { NextRequest, NextResponse } from "next/server";
import { db } from "../../firebase/clientApp"; // adjust path
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const { id, ...fields } = await req.json();
    if (!id) throw new Error("Missing document ID");
    await updateDoc(doc(db, "locations", id), fields);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message },
      { status: 500 }
    );
  }
}
