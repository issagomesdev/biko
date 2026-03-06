import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "@/src/components/ui/Button"

describe("Button", () => {
  it("renderiza o texto filho", () => {
    render(<Button>Entrar</Button>)
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument()
  })

  it("mostra spinner quando loading=true", () => {
    render(<Button loading>Entrar</Button>)
    expect(screen.queryByText("Entrar")).not.toBeInTheDocument()
    expect(document.querySelector(".animate-spin")).toBeInTheDocument()
  })

  it("está desabilitado quando loading=true", () => {
    render(<Button loading>Entrar</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("está desabilitado quando disabled=true", () => {
    render(<Button disabled>Entrar</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("chama onClick quando clicado", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Clique</Button>)
    await userEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("não chama onClick quando desabilitado", async () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Clique</Button>)
    await userEvent.click(screen.getByRole("button"))
    expect(onClick).not.toHaveBeenCalled()
  })

  it("aplica variant primary por padrão (bg-black)", () => {
    render(<Button>Entrar</Button>)
    expect(screen.getByRole("button").className).toContain("bg-black")
  })

  it("aplica variant yellow", () => {
    render(<Button variant="yellow">Entrar</Button>)
    expect(screen.getByRole("button").className).toContain("bg-primary")
  })

  it("aplica variant secondary", () => {
    render(<Button variant="secondary">Entrar</Button>)
    expect(screen.getByRole("button").className).toContain("bg-black/10")
  })
})
