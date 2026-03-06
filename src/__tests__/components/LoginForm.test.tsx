import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { LoginForm } from "@/src/components/auth/LoginForm"

// ── Hoisted mocks (executados antes dos imports) ──────────────────────────────

const { mockSetUser, mockToast, mockLogin, mockGet } = vi.hoisted(() => ({
  mockSetUser: vi.fn(),
  mockToast:   { success: vi.fn(), error: vi.fn() },
  mockLogin:   vi.fn(),
  mockGet:     vi.fn(() => null),
}))

vi.mock("next/navigation", () => ({
  useSearchParams: () => ({ get: mockGet }),
}))

vi.mock("next/link", () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    <a href={href}>{children}</a>,
}))

vi.mock("sonner", () => ({ toast: mockToast }))

vi.mock("@/src/services/auth-service", () => ({
  authService: { login: (...args: unknown[]) => mockLogin(...args) },
}))

vi.mock("@/src/stores/user-store", () => ({
  useUserStore: (sel: (s: { setUser: typeof mockSetUser }) => unknown) =>
    sel({ setUser: mockSetUser }),
}))

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fillAndSubmit(email = "user@test.com", password = "12345678") {
  await userEvent.type(screen.getByPlaceholderText("seu@email.com"), email)
  await userEvent.type(screen.getByPlaceholderText("••••••••"), password)
  await userEvent.click(screen.getByRole("button", { name: /entrar/i }))
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGet.mockReturnValue(null)
})

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("LoginForm", () => {
  it("renderiza campos de email e senha", () => {
    render(<LoginForm />)
    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument()
  })

  it("renderiza link para /register", () => {
    render(<LoginForm />)
    expect(screen.getByRole("link", { name: /cadastre-se/i })).toHaveAttribute("href", "/register")
  })

  it("exibe erro de validação para e-mail inválido", async () => {
    render(<LoginForm />)
    // Submete sem preencher email — campo vazio passa native validation (sem required)
    // mas falha em z.string().email() → "E-mail inválido"
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }))
    await waitFor(() => expect(screen.getByText("E-mail inválido")).toBeInTheDocument())
  })

  it("chama authService.login com dados do formulário", async () => {
    mockLogin.mockResolvedValue({
      user: { id: 1, name: "João", username: "joao", email: "user@test.com", categories: [], is_private: null, is_online: true },
      message: null,
    })
    render(<LoginForm />)
    await fillAndSubmit()
    await waitFor(() => expect(mockLogin).toHaveBeenCalledWith({
      email: "user@test.com", password: "12345678",
    }))
  })

  it("chama setUser e exibe toast de sucesso com message", async () => {
    const user = { id: 1, name: "João", username: "joao", email: "user@test.com", categories: [], is_private: null, is_online: true }
    mockLogin.mockResolvedValue({ user, message: "Bem-vindo!" })
    render(<LoginForm />)
    await fillAndSubmit()
    await waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith(user)
      expect(mockToast.success).toHaveBeenCalledWith("Bem-vindo!")
    })
  })

  it("exibe toast de erro quando login falha", async () => {
    mockLogin.mockRejectedValue(new Error("Credenciais inválidas"))
    render(<LoginForm />)
    await fillAndSubmit()
    await waitFor(() => expect(mockToast.error).toHaveBeenCalledWith("Credenciais inválidas"))
  })

  it("exibe toast a partir do ?message na URL ao montar", () => {
    mockGet.mockReturnValue("Desconectado")
    render(<LoginForm />)
    expect(mockToast.success).toHaveBeenCalledWith("Desconectado")
  })

  it("decodifica URI do ?message", () => {
    mockGet.mockReturnValue("Sess%C3%A3o%20expirada")
    render(<LoginForm />)
    expect(mockToast.success).toHaveBeenCalledWith("Sessão expirada")
  })

  it("não exibe toast quando não há ?message", () => {
    mockGet.mockReturnValue(null)
    render(<LoginForm />)
    expect(mockToast.success).not.toHaveBeenCalled()
  })
})
