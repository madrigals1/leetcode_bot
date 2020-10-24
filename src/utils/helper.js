// eslint-disable-next-line no-console
const log = (...args) => console.log(...args);

// eslint-disable-next-line no-console
const error = (...args) => console.error(...args);

const delay = (msTime) => new Promise((res) => setTimeout(res, msTime));

module.exports = { log, error, delay };
