import { OnboardingLayout } from "@/src/components/auth/OnboardingLayout"
import { ServicesForm } from "@/src/components/auth/ServicesForm"

export default function ServicesPage() {
  return (
    <OnboardingLayout cardWidth="max-w-[700px]">
      <ServicesForm />
    </OnboardingLayout>
  )
}
