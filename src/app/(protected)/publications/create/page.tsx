"use client"

import { useRouter }               from "next/navigation"
import { useMutation }             from "@tanstack/react-query"
import { toast }                   from "sonner"

import { useUserStore }            from "@/src/stores/user-store"
import { useCategories }           from "@/src/hooks/use-categories"
import { usePublicationForm }      from "@/src/hooks/usePublicationForm"
import { PublicationFormShell }    from "@/src/components/publication/PublicationFormShell"
import type { Category }           from "@/src/types/api"

export default function CreatePublicationPage() {
  const router      = useRouter()
  const currentUser = useUserStore((s) => s.user)
  const { data: categoriesRes } = useCategories()
  const categories: Category[]  = (categoriesRes as any)?.data ?? []

  const form = usePublicationForm()

  const { mutate: publish, isPending } = useMutation({
    mutationFn: () => form.submit(),
    onSuccess: () => { toast.success("Publicação criada!"); router.push("/feed") },
    onError:   (err: Error) => toast.error(err.message),
  })

  return (
    <PublicationFormShell
      title="Nova Publicação"
      submitLabel="Publicar"
      isPending={isPending}
      onSubmit={() => publish()}
      onBack={() => router.back()}
      form={form}
      categories={categories}
      currentUser={currentUser}
    />
  )
}
