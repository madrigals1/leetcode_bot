export interface VizapiResponse {
  link?: string;
  error?: string;
  reason?: string;
}

export interface CompareField {
  name: string;
  value: string | number;
}

export interface CompareUser {
  image: string;
  bio_fields: CompareField[];
  compare_fields: CompareField[];
}
