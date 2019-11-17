export const removeAccents = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export const searchNormalizer = (s: string) => removeAccents(s.toLocaleLowerCase().trim())

export function replaceAll(s: string, searchValue: string, replaceValue: string): string {
  const newString = s.replace(searchValue, replaceValue)
  return newString === s ? newString : replaceAll(newString, searchValue, replaceValue)
}
