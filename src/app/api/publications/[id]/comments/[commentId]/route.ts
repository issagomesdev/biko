import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL

type Ctx = { params: Promise<{ id: string; commentId: string }> }

export async function PUT(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token")?.value
  if (!token) return NextResponse.json({ success: false, message: "Não autenticado" }, { status: 401 })

  const { commentId } = await params
  const formData = await req.formData().catch(() => new FormData())
  formData.set("_method", "PUT")

  const upstream = await fetch(`${API_URL}/publications/comment/${commentId}`, {
    method:  "POST",
    headers: {
      "Accept":        "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  })

  const data = await upstream.json().catch(() => ({}))
  return NextResponse.json(data, { status: upstream.status })
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const token = req.cookies.get("token")?.value
  if (!token) return NextResponse.json({ success: false, message: "Não autenticado" }, { status: 401 })

  const { commentId } = await params

  const upstream = await fetch(`${API_URL}/publications/comment/${commentId}`, {
    method:  "DELETE",
    headers: {
      "Accept":        "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })

  const data = await upstream.json().catch(() => ({}))
  return NextResponse.json(data, { status: upstream.status })
}
