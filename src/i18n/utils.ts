import { zh } from "./zh";
import type { I18nStrings } from "./types";

const translations: I18nStrings = zh;

export function t(key: keyof I18nStrings): string {
  return translations[key];
}
