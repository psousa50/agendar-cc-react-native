export const removeAccents = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
