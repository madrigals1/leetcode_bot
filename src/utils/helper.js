// eslint-disable-next-line no-console
const log = (...args) => console.log(...args);

// eslint-disable-next-line no-console
const error = (...args) => console.error(...args);

const delay = (msTime) => new Promise((res) => setTimeout(res, msTime));

const isTrue = (value) => (
  ['true', 'True', '1', 't', 'T', 1, true].includes(value)
);

module.exports = {
  log, error, delay, isTrue,
};
