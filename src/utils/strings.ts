export const removeAccents = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export const searchNormalizer = (s: string) => removeAccents(s.toLocaleLowerCase().trim())
