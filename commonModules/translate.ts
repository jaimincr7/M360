import {
  languageSelector,
  LanguageState,
} from "../store/language/languageSlice";
import { useAppSelector } from "../utils/hooks";
import { langConversionJson } from "../utils/translations";

const defaultLang = "en";

//Common method for Languages translation.
export const useTranslate = () => {
  const lg = useAppSelector(languageSelector);
  return (label: string) =>
    langConversionJson[lg.language][label] ||
    langConversionJson[defaultLang][label];
};
