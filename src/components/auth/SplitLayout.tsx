interface SplitLayoutProps {
  panel: React.ReactNode;
  children: React.ReactNode;
  panelSide?: "left" | "right";
}

export function SplitLayout({ panel, children, panelSide = "left" }: SplitLayoutProps) {
  const isLeft = panelSide === "left";

  return (
    <div className="flex min-h-screen">
      {isLeft && panel}

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-[#FAFAFA] px-[100px] py-[80px] max-md:px-0 max-md:py-0 max-md:bg-white max-md:flex-col max-md:justify-start max-md:items-stretch">
        {children}
      </div>

      {!isLeft && panel}
    </div>
  );
}
