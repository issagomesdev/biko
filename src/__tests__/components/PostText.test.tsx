import { render, screen } from "@testing-library/react"
import { PostText } from "@/src/components/post/PostText"

const mentions = [
  { id: 1, username: "joao.silva" },
  { id: 2, username: "maria" },
]

describe("PostText", () => {
  it("renders plain text with no highlights", () => {
    render(<PostText text="Texto simples sem menções" mentions={[]} tags={[]} />)
    expect(screen.getByText(/Texto simples sem menções/)).toBeInTheDocument()
    expect(document.querySelectorAll(".text-primary")).toHaveLength(0)
  })

  it("highlights @mention present in mentions list", () => {
    render(<PostText text="Olá @joao.silva, tudo bem?" mentions={mentions} tags={[]} />)
    const highlighted = screen.getByText("@joao.silva")
    expect(highlighted).toHaveClass("text-primary")
  })

  it("does NOT highlight @mention absent from mentions list", () => {
    render(<PostText text="Olá @desconhecido, tudo bem?" mentions={mentions} tags={[]} />)
    const span = screen.getByText("@desconhecido")
    expect(span).not.toHaveClass("text-primary")
  })

  it("highlights mention case-insensitively", () => {
    render(<PostText text="Oi @MARIA aqui" mentions={mentions} tags={[]} />)
    const highlighted = screen.getByText("@MARIA")
    expect(highlighted).toHaveClass("text-primary")
  })

  it("handles username with dot (@parker.mason)", () => {
    const dotMentions = [{ id: 3, username: "parker.mason" }]
    render(<PostText text="Veja @parker.mason no projeto" mentions={dotMentions} tags={[]} />)
    const highlighted = screen.getByText("@parker.mason")
    expect(highlighted).toHaveClass("text-primary")
  })

  it("renders tags with # prefix", () => {
    render(<PostText text="Post com tags" mentions={[]} tags={["trabalho", "resultado"]} />)
    expect(screen.getByText("#trabalho")).toBeInTheDocument()
    expect(screen.getByText("#resultado")).toBeInTheDocument()
  })

  it("renders no tag spans when tags array is empty", () => {
    render(<PostText text="Post sem tags" mentions={[]} tags={[]} />)
    expect(document.querySelectorAll(".text-secondary")).toHaveLength(0)
  })

  it("renders both mention and tags together", () => {
    render(<PostText text="Oi @maria, veja isso" mentions={mentions} tags={["urgente"]} />)
    expect(screen.getByText("@maria")).toHaveClass("text-primary")
    expect(screen.getByText("#urgente")).toBeInTheDocument()
  })
})
