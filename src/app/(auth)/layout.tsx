interface AuthLayoutProps {
  panel: React.ReactNode;
  children: React.ReactNode;
  panelSide?: "left" | "right";
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
