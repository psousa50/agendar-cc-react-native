export const replaceByIndex = <T>(col: T[], newValue: T, index: number) =>
  col.map((v, i) => (i === index ? newValue : v))

export const mergeCollection = <S, T = S>(criteria: (s: S) => (t: T) => boolean, merge: (s: S, t?: T) => T) => (
  col: S[],
): T[] =>
  col.reduce(
    (acc, cur) => {
      const index = acc.findIndex(criteria(cur))
      return index >= 0 ? replaceByIndex(acc, merge(cur, acc[index]), index) : [...acc, merge(cur)]
    },
    [] as T[],
  )

export const mergeIntoCollection = <S>(criteria: (s1: S) => (s2: S) => boolean, merge: (s1: S, s2: S) => S) => (
  col: S[],
  toMerge: S,
): S[] => {
  const index = col.findIndex(criteria(toMerge))
  return index >= 0 ? replaceByIndex(col, merge(col[index], toMerge), index) : [...col, toMerge]
}
