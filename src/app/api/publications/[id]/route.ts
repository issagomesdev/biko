import { NextRequest, NextResponse } from "next/server"

const API_URL = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token")?.value
  const { id } = await params

  const upstream = await fetch(`${API_URL}/publications/${id}`, {
    headers: {
      "Accept":        "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
  })

  const data = await upstream.json().catch(() => ({}))
  return NextResponse.json(data, { status: upstream.status })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token")?.value
  if (!token) {
    return NextResponse.json({ success: false, message: "Não autenticado" }, { status: 401 })
  }

  const { id } = await params

  const upstream = await fetch(`${API_URL}/publications/${id}`, {
    method:  "DELETE",
    headers: {
      "Accept":        "application/json",
      "Authorization": `Bearer ${token}`,
    },
  })

  const data = await upstream.json().catch(() => ({}))
  return NextResponse.json(data, { status: upstream.status })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token")?.value
  if (!token) {
    return NextResponse.json({ success: false, message: "Não autenticado" }, { status: 401 })
  }

  const { id }   = await params
  const formData = await req.formData().catch(() => new FormData())
  formData.set("_method", "PUT")

  const upstream = await fetch(`${API_URL}/publications/${id}`, {
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
