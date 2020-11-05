const axios = require('axios');

const { TABLE_API_LINK } = require('../utils/constants');
const { log, error } = require('../utils/helper');
const { SERVER_MESSAGES, BOT_MESSAGES } = require('../utils/dictionary');

const tableForSubmissions = (user) => axios
  .post(TABLE_API_LINK, {
    table: user.submissions.map((submission) => (
      {
        Name: submission.name,
        Time: submission.time,
        Language: submission.language,
        Status: submission.status,
      }
    )),
  })
  .then((res) => {
    log(SERVER_MESSAGES.IMAGE_WAS_CREATED);
    if (res.data.detail === 'Please, provide \'table\' in request body') {
      return {
        error: BOT_MESSAGES.USER_NO_SUBMISSIONS(user.username),
        reason: SERVER_MESSAGES.NO_SUBMISSIONS,
      };
    }
    return { link: res.data.link };
  })
  .catch((err) => {
    error(SERVER_MESSAGES.IMAGE_WAS_NOT_CREATED);
    error(err);
    return { error: err, reason: SERVER_MESSAGES.API_NOT_WORKING };
  });

module.exports = { tableForSubmissions };
