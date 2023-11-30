import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../utils/store";

export interface LanguageState {
  language: string;
}

const initialState: LanguageState = {
  language: "en",
};

export const language = createSlice({
  name: "language",
  initialState,
  reducers: {
    changeLanguage: (state, actions) => {
      state.language = actions.payload;
    },
  },
});

export const { changeLanguage } = language.actions;

export const languageSelector = (state: RootState) => state.language;

export default language.reducer;
