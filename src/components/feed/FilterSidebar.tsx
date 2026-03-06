import { Icon } from "@iconify/react"

const FILTERS = [
  { label: "Serviço", placeholder: "Todos os serviços" },
  { label: "Tipo",    placeholder: "Todos"              },
  { label: "Estado",  placeholder: "Todos os estados"   },
  { label: "Cidade",  placeholder: "Todas as cidades"   },
  { label: "Data",    placeholder: "Últimos 7 dias"     },
]

export function FilterSidebar() {
  return (
    <aside className="w-[280px] shrink-0">
      <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-5">
        <h3 className="font-sora font-semibold text-base text-black">Filtros</h3>

        {FILTERS.map((f) => (
          <div key={f.label} className="flex flex-col gap-2">
            <span className="font-inter text-[13px] font-medium text-[#666666]">{f.label}</span>
            <button className="h-10 rounded-lg bg-[#F5F5F5] px-3 flex items-center justify-between w-full">
              <span className="font-inter text-sm text-[#333333]">{f.placeholder}</span>
              <Icon icon="lucide:chevron-down" width={16} height={16} className="text-[#999999]" />
            </button>
          </div>
        ))}
      </div>
    </aside>
  )
}
