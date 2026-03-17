import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token")?.value
  if (!token) {
    return NextResponse.json({ success: false, message: "Não autenticado" }, { status: 401 })
  }

  const { id }  = await params
  const unblock = req.nextUrl.searchParams.get("unblock") === "1"

  const upstream = await fetch(`${API_URL}/users/${unblock ? "unblock" : "block"}/${id}`, {
    method:  "POST",
    headers: {
      "Accept":        "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })

  const data = await upstream.json().catch(() => ({}))
  return NextResponse.json(data, { status: upstream.status })
}
