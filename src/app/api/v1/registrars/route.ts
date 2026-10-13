import { NextResponse } from "next/server";
import { listRegistrars } from "@/lib/data/catalog";

export async function GET() {
  const data = await listRegistrars();
  return NextResponse.json({ data, count: data.length });
}
