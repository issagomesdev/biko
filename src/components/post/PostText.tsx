"use client"

interface Props {
  text:       string
  mentions:   { id: number; username: string }[]
  tags:       string[]
  className?: string
}

export function PostText({ text, mentions, tags, className }: Props) {
  const mentionSet = new Set(mentions.map((m) => m.username?.toLowerCase()))
  const parts = text.split(/(@[\w.]+)/g)

  return (
    <p className={className}>
      {parts.map((part, i) =>
        /^@[\w.]+$/.test(part) && mentionSet.has(part.slice(1).toLowerCase())
          ? <span key={i} className="text-primary font-medium cursor-pointer">{part}</span>
          : <span key={i}>{part}</span>
      )}
      {tags.map((tag) => (
        <span key={tag} className="text-secondary ml-1 font-black cursor-pointer">#{tag}</span>
      ))}
    </p>
  )
}
