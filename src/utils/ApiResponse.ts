import { NextResponse } from "next/server";

const response = (success: boolean, message: string, data?: any , statusCode?: number) => {
  return NextResponse.json(
    { success, message, data },
    { status: statusCode ?? (success ? 200 : 400) }
  );
};

export default response;


export interface ApiResponse{
  success: boolean;
  message: string;
  isAcceptingMessages? : boolean;
  messages? : Array<string>;
}