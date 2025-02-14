import { NextResponse } from "next/server";

export const successResponse = (data: any, message: string, status = 200) => {
  return NextResponse.json({ success: true, message, data }, { status })
}

export const errorResponse = (message: string, status = 500, details?: any) => {
  return NextResponse.json({ success: false, message, ...(details && { details }) }, { status })
}
