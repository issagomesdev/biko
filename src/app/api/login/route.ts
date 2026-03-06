import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL

export async function POST(req: NextRequest) {
  const body = await req.json()

  const upstream = await fetch(`${API_URL}/login`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body:    JSON.stringify(body),
  })

  const data = await upstream.json()

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status })
  }

  const token    = data.data?.token
  const userData = data.data?.data

  const response = NextResponse.json({
    success:  true,
    message:  data.message ?? null,
    user: {
      id:         userData.id,
      name:       userData.name,
      username:   userData.username,
      email:      userData.email,
      categories: userData.categories ?? [],
      is_private: userData.is_private,
      is_online:  userData.is_online,
    },
  })

  response.cookies.set("token", token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   60 * 60 * 24 * 7, // 7 dias
    path:     "/",
  })

  return response
}
