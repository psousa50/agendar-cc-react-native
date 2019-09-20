export const replaceByIndex = <T>(col: T[], newValue: T, index: number) =>
  col.map((v, i) => (i === index ? newValue : v))

export const groupCollection = <T, K>(keyExtrator: (t: T) => K, col: T[]): Array<{ key: K; group: T[] }> =>
  col.reduce(
    (acc, cur) => {
      const key = keyExtrator(cur)
      const index = acc.findIndex(g => g.key === key)
      return index >= 0
        ? replaceByIndex(acc, { key, group: [...acc[index].group, cur] }, index)
        : [...acc, { key, group: [cur] }]
    },
    [] as Array<{ key: K; group: T[] }>,
  )

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

export const flatten = <T>(list: T[][]) => list.reduce((acc, cur) => [...acc, ...cur], [] as T[])

export const max = <T>(col: T[]) =>
  col.length > 0 ? col.reduce((acc, d) => (acc ? (d > acc ? d : acc) : d), col[0]) : undefined
export const min = <T>(col: T[]) =>
  col.length > 0 ? col.reduce((acc, d) => (acc ? (d < acc ? d : acc) : d), col[0]) : undefined
