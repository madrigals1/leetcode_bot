export interface LanguageNode {
  id: number;
  name: string;
  verboseName: string;
}

export interface SubmissionDumpNode {
  lang: string;
  statusDisplay: string;
  timestamp: string;
  title: string;
  titleSlug: string;
}

export interface RecentSubmissionList {
  languageList: LanguageNode[];
  recentSubmissionList: SubmissionDumpNode[];
}
