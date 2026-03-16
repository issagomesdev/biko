import { SplitLayout } from "@/src/components/auth/SplitLayout";
import { AuthPanel } from "@/src/components/auth/AuthPanel";
import { LoginForm } from "@/src/components/auth/LoginForm";
import { MobileAuthHeader } from "@/src/components/auth/MobileAuthHeader";

export default function LoginPage() {
  return (
    <SplitLayout
      panelSide="left"
      panel={
        <AuthPanel
          title={"Conecte-se aos\nmelhores serviços\nda sua região"}
          description="Uma rede social onde prestadores de serviços compartilham seus trabalhos e clientes encontram os profissionais ideais."
        />
      }
    >
      <MobileAuthHeader
        title="Bem-vindo de volta"
        subtitle="Entre na sua conta para continuar"
      />
      <LoginForm />
    </SplitLayout>
  );
}
