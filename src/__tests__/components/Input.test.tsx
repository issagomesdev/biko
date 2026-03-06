import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { createRef } from "react"
import { Input } from "@/src/components/ui/Input"

describe("Input", () => {
  it("renderiza com label", () => {
    render(<Input label="Email" />)
    expect(screen.getByText("Email")).toBeInTheDocument()
  })

  it("renderiza sem label quando não fornecido", () => {
    const { container } = render(<Input placeholder="Email" />)
    expect(container.querySelector("label")).toBeNull()
  })

  it("exibe mensagem de erro", () => {
    render(<Input error="E-mail inválido" />)
    expect(screen.getByText("E-mail inválido")).toBeInTheDocument()
  })

  it("não exibe erro quando não fornecido", () => {
    const { container } = render(<Input label="Email" />)
    expect(container.querySelector("span")).toBeNull()
  })

  it("aplica borda vermelha com erro", () => {
    render(<Input error="Campo obrigatório" />)
    const input = screen.getByRole("textbox")
    expect(input.className).toContain("border-red-400")
  })

  it("aceita digitação do usuário", async () => {
    render(<Input label="Email" />)
    const input = screen.getByRole("textbox")
    await userEvent.type(input, "teste@email.com")
    expect(input).toHaveValue("teste@email.com")
  })

  it("encaminha ref corretamente", () => {
    const ref = createRef<HTMLInputElement>()
    render(<Input ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it("repassa props HTML nativas (placeholder, type)", () => {
    render(<Input type="password" placeholder="••••••••" />)
    const input = document.querySelector("input")!
    expect(input.type).toBe("password")
    expect(input.placeholder).toBe("••••••••")
  })
})
