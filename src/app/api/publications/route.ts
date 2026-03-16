import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  const qs = req.nextUrl.searchParams.toString()
  const url = `${API_URL}/publications${qs ? `?${qs}` : ""}`

  const upstream = await fetch(url, {
    headers: {
      "Accept": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
  })

  const data = await upstream.json().catch(() => ({}))
  return NextResponse.json(data, { status: upstream.status })
}
