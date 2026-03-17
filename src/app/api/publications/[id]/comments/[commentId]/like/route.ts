import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  const token = req.cookies.get("token")?.value
  if (!token) {
    return NextResponse.json({ success: false, message: "Não autenticado" }, { status: 401 })
  }

  const { commentId } = await params

  const upstream = await fetch(`${API_URL}/publications/comment/${commentId}/like`, {
    method:  "POST",
    headers: {
      "Accept":        "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })

  const data = await upstream.json().catch(() => ({}))
  return NextResponse.json(data, { status: upstream.status })
}
