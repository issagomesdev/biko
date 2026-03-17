"use client"

import { useState }                from "react"
import { useParams, useRouter }    from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast }                   from "sonner"

import { useUserStore }            from "@/src/stores/user-store"
import { useCategories }           from "@/src/hooks/use-categories"
import { usePublicationForm }      from "@/src/hooks/usePublicationForm"
import { PublicationFormShell }    from "@/src/components/publication/PublicationFormShell"
import type { Category }           from "@/src/types/api"
import type { Publication, PublicationMedia } from "@/src/types/publication"
import type { UserOption }         from "@/src/services/user-service"

async function fetchPublication(id: string): Promise<Publication> {
  const res  = await fetch(`/api/publications/${id}`, { credentials: "include" })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message ?? "Erro ao carregar publicação")
  return data.data as Publication
}

// ── inner form (mounts only when pub is ready so hook inits with real data) ──

function EditForm({ pub, categories, onBack, onSaved }: {
  pub:        Publication
  categories: Category[]
  onBack:     () => void
  onSaved:    (updated: Publication) => void
}) {
  const currentUser = useUserStore((s) => s.user)

  const form = usePublicationForm({
    text:               pub.text,
    pubType:            pub.type,
    selectedCategories: pub.categories.map((c) => c.id),
    tags:               pub.tags,
    mentionedUsers:     pub.mentions.map((m): UserOption => ({
      id: m.id, name: "", username: m.username, avatar: null,
    })),
    cityId:  pub.city?.id        ?? null,
    stateId: pub.city?.state?.id ?? null,
  })

  const [removedMediaIds, setRemovedMediaIds] = useState<number[]>([])
  const existingMedia = pub.media.filter((m) => !removedMediaIds.includes(m.id))

  const { mutate: save, isPending } = useMutation({
    mutationFn: async () => {
      const fd = form.buildFormData()
      removedMediaIds.forEach((mid) => fd.append("remove_media[]", String(mid)))
      const res  = await fetch(`/api/publications/${pub.id}`, {
        method: "POST", credentials: "include", body: fd,
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message ?? "Erro ao salvar")
      return data.data
    },
    onSuccess: (updated) => { toast.success("Publicação atualizada!"); onSaved(updated); onBack() },
    onError:   (err: Error) => toast.error(err.message),
  })

  return (
    <PublicationFormShell
      title="Editar Publicação"
      submitLabel="Salvar"
      isPending={isPending}
      onSubmit={() => save()}
      onBack={onBack}
      form={form}
      categories={categories}
      currentUser={currentUser}
      existingMedia={existingMedia}
      onRemoveExistingMedia={(id) => setRemovedMediaIds((prev) => [...prev, id])}
    />
  )
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function EditPublicationPage() {
  const { id }        = useParams<{ id: string }>()
  const router        = useRouter()
  const queryClient   = useQueryClient()
  const { data: categoriesRes } = useCategories()
  const categories: Category[]  = (categoriesRes as any)?.data ?? []

  const { data: pub, isLoading, isError } = useQuery({
    queryKey: ["publication", id],
    queryFn:  () => fetchPublication(id),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
      </div>
    )
  }

  if (isError || !pub) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <p className="font-inter text-sm text-[#666666]">Publicação não encontrada.</p>
          <button onClick={() => router.back()} className="mt-4 font-inter text-sm text-black underline">Voltar</button>
        </div>
      </div>
    )
  }

  return (
    <EditForm
      pub={pub}
      categories={categories}
      onBack={() => router.back()}
      onSaved={(updated) => {
        queryClient.setQueryData(["publication", id], updated)
        queryClient.invalidateQueries({ queryKey: ["publications"] })
      }}
    />
  )
}
