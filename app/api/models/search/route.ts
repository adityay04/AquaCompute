import { NextRequest, NextResponse } from "next/server";
import { searchModels } from "@/lib/openrouter";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") || "";
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20", 10);

  const models = await searchModels(query, limit);
  return NextResponse.json({ models });
}
