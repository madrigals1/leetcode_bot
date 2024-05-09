export interface LanguageProblemCount {
  languageName: string;
  problemsSolved: number;
}

export interface LanguageStats {
  matchedUser: {
    languageProblemCount: LanguageProblemCount[];
  };
}
