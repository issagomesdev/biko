export const SERVICE_CATEGORIES = [
  "Ajudante geral",
  "Babá",
  "Barbeiro",
  "Cabeleireiro",
  "Carpinteiro",
  "Costureira / Ajustes",
  "Cuidador de idoso",
  "Diarista / Limpeza",
  "Eletricista",
  "Encanador",
  "Jardineiro",
  "Lavadeira / Passadeira",
  "Mecânico",
  "Motorista",
  "Pedreiro",
  "Pintor",
  "Personal trainer",
  "Reforço escolar",
  "Entregador / Motoboy",
  "Mudança / Frete",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];
