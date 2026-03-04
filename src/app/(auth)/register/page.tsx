import { SplitLayout } from "@/src/components/auth/SplitLayout";
import { AuthPanel } from "@/src/components/auth/AuthPanel";
import { RegisterForm } from "@/src/components/auth/RegisterForm";
import { MobileAuthHeader } from "@/src/components/auth/MobileAuthHeader";

export default function RegisterPage() {
  return (
    <SplitLayout
      panelSide="right"
      panel={
        <AuthPanel
          title={"Faça parte da\nmaior comunidade\nde serviços"}
          description="Seja você prestador ou cliente, o Biko é o lugar perfeito para encontrar oportunidades e conectar-se com pessoas incríveis."
        />
      }
    >
      <MobileAuthHeader
        title="Crie sua conta"
        subtitle="Preencha os dados para começar"
      />
      <RegisterForm />
    </SplitLayout>
  );
}
