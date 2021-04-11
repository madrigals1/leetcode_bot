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

export interface Compare {
  left: CompareUser;
  right: CompareUser;
}
