import { NextResponse } from "next/server";
import { listTlds } from "@/lib/data/catalog";

export async function GET() {
  const data = await listTlds();
  return NextResponse.json({ data, count: data.length });
}
