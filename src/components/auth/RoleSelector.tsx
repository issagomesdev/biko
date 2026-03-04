"use client";

import { Icon } from "@iconify/react";

type Role = "provider" | "client";

interface RoleSelectorProps {
  value: Role | undefined;
  onChange: (role: Role) => void;
  error?: string;
}

const OPTIONS: { value: Role; label: string; icon: string }[] = [
  { value: "provider", label: "Prestador", icon: "lucide:briefcase" },
  { value: "client", label: "Cliente", icon: "lucide:user" },
];

export function RoleSelector({ value, onChange, error }: RoleSelectorProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="font-inter text-sm font-medium text-black">Você é:</span>
      <div className="flex gap-3">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 h-[72px] rounded-xl border-2 shadow-sm transition-all font-inter text-sm font-medium ${
                selected
                  ? "border-black bg-primary text-black"
                  : "border-transparent bg-white text-[#666666] hover:border-black/20"
              }`}
            >
              <Icon icon={opt.icon} width={24} height={24} />
              {opt.label}
            </button>
          );
        })}
      </div>
      {error && <span className="font-inter text-xs text-red-500">{error}</span>}
    </div>
  );
}
