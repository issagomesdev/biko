import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  let message = "Desconectado com sucesso"

  if (token) {
    try {
      const upstream = await fetch(`${API_URL}/logout`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          "Accept":        "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
      const data = await upstream.json().catch(() => ({}))
      if (data.message) message = data.message
    } catch {}
  }

  const response = NextResponse.json({ success: true, message })
  response.cookies.set("token", "", { maxAge: 0, path: "/" })
  return response
}
