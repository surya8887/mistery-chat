import { NextResponse } from "next/server";

const response = (success: boolean, message: string, data: any = null, statusCode?: number) => {
  return NextResponse.json(
    { success, message, data },
    { status: statusCode ?? (success ? 200 : 400) }
  );
};

export default response;
