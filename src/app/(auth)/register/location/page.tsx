import { Suspense } from "react"
import { OnboardingLayout } from "@/src/components/auth/OnboardingLayout"
import { LocationForm } from "@/src/components/auth/LocationForm"

export default function LocationPage() {
  return (
    <OnboardingLayout cardWidth="max-w-[420px]">
      {/* Suspense required because LocationForm uses useSearchParams */}
      <Suspense>
        <LocationForm />
      </Suspense>
    </OnboardingLayout>
  )
}
