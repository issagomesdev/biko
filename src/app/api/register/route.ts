import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL

export async function POST(req: NextRequest) {
  const body = await req.json()

  const upstream = await fetch(`${API_URL}/register`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body:    JSON.stringify(body),
  })

  const data = await upstream.json()

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status })
  }

  return NextResponse.json({ success: true, message: data.message ?? null })
}
