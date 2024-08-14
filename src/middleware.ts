import { v4 as uuid } from "uuid";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.cookies.has("userId")) {
    return NextResponse.next();
  }

  const userId = uuid();
  request.cookies.set("userId", userId);

  const response = NextResponse.next({ request });
  response.cookies.set("userId", userId);
  return response;
}
