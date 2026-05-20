import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = db.prepare("DELETE FROM expenses WHERE id = ?").run(id);

  if (!result.changes) 
    {
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  }
  return NextResponse.json({ ok: true });
}
