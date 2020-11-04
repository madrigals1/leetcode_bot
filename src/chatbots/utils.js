const axios = require('axios');

const { TABLE_API_LINK } = require('../utils/constants');
const { log, error } = require('../utils/helper');
const { SERVER_MESSAGES } = require('../utils/dictionary');

const tableForSubmissions = (users) => axios
  .post(TABLE_API_LINK, { table: users })
  .then((res) => {
    log(SERVER_MESSAGES.IMAGE_WAS_CREATED);
    return res.data.link;
  })
  .catch(() => {
    error(SERVER_MESSAGES.IMAGE_WAS_NOT_CREATED);
    return false;
  });

module.exports = { tableForSubmissions };
