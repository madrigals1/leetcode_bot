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
  // eslint-disable-next-line camelcase
  bio_fields: CompareField[];
  // eslint-disable-next-line camelcase
  compare_fields: CompareField[];
}
