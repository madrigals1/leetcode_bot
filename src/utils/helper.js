// eslint-disable-next-line no-console
export const log = (...args) => console.log(...args);

// eslint-disable-next-line no-console
export const error = (...args) => console.error(...args);

export const delay = (msTime) => new Promise((res) => setTimeout(res, msTime));

export const isTrue = (value) => (
  ['true', 'True', '1', 't', 'T', 1, true].includes(value)
);
