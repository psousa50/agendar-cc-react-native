import I18n, { TranslateOptions } from "i18n-js"
import * as RNLocalize from "react-native-localize"

import { en } from "./locales/en"
import { pt } from "./locales/pt"

const locales = RNLocalize.getLocales()

if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageTag
}

I18n.fallbacks = true
I18n.translations = {
  en,
  pt,
}

type LocalesString = typeof en

export const i18n = { ...I18n, t: (s: keyof LocalesString, options?: TranslateOptions) => I18n.t(s, options) }
