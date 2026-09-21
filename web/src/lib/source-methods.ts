export const SOURCE_METHODS = [
  { value: "api", label: "Resmi API" },
  { value: "json_ld", label: "JSON-LD (sayfa verisi)" },
  { value: "http", label: "İç JSON / HTTP" },
  { value: "browser", label: "Tarayıcı (Playwright)" },
];

export function methodLabel(value: string): string {
  return SOURCE_METHODS.find((m) => m.value === value)?.label ?? value;
}