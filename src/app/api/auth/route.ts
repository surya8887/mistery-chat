import { DBConnect } from "@/lib/db";
import response from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await DBConnect();
    return response(true, "DB connection successful", null, 200);
  } catch (error) {
    return response(false, "DB connection failed", error, 500);
  }
}
