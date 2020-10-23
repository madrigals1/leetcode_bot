const log = (...args) => {
  // eslint-disable-next-line no-console
  console.log(...args);
};

const error = (...args) => {
  // eslint-disable-next-line no-console
  console.error(...args);
};

const replaceAll = (text, regBefore, regAfter) => (
  text.split(regBefore).join(regAfter)
);

const delay = (msTime) => new Promise((res) => setTimeout(res, msTime));

module.exports = {
  log, error, delay, replaceAll,
};
