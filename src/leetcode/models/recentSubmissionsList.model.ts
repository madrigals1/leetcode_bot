export interface LanguageNode {
  id: number;
  name: string;
  verboseName: string;
}

export interface SubmissionDumpNode {
  lang: string;
  statusDisplay: string;
  time: string;
  title: string;
  titleSlug: string;
  memory: string;
  runtime: string;
}

export interface RecentSubmissionList {
  languageList: LanguageNode[];
  recentSubmissionList: SubmissionDumpNode[];
}
