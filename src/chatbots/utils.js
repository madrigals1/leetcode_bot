const fs = require('fs');

const puppeteer = require('puppeteer');
const uuid4 = require('uuid4');

const { log, error } = require('../utils/helper');
const { SERVER_MESSAGES } = require('../utils/dictionary');

const generateImagePath = () => {
  // Generate uuid for image in tmp folder
  const uuid = uuid4().toString();

  return `./tmp/image_${uuid}.png`;
};

const tableForSubmissions = async (path, user) => {
  const content = `
<html lang="en">
  <head>
    <title>{user.username}</title>
    <style>
      table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
      }
      td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      tr:nth-child(even) {
        background-color: #dddddd;
      }
    </style>
  </head>
  <body>
  
    <table>
      <tr>
        <th>Name</th>
        <th>Time</th>
        <th>Language</th>
        <th>Status</th>
      </tr>
      ${user.submissions.map((submission) => `<tr>
        <th>${submission.name}</th>
        <th>${submission.time}</th>
        <th>${submission.language}</th>
        <th>${submission.status}</th>
      </tr>`)
    .join('')}
    </table>
    
  </body>
</html>
  `;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
      width: 960,
      height: 760,
      deviceScaleFactor: 1,
    });
    await page.setContent(content);
    await page.screenshot({ path });
    await browser.close();
    log(SERVER_MESSAGES.IMAGE_WAS_CREATED(path));
    return true;
  } catch (err) {
    error(SERVER_MESSAGES.IMAGE_WAS_NOT_CREATED(err));
    return false;
  }
};

const deleteFile = (path) => {
  fs.unlink(path, (err) => {
    if (err) error(SERVER_MESSAGES.ERROR_ON_THE_SERVER(err));
    log(SERVER_MESSAGES.FILE_WAS_DELETED(path));
  });
};

module.exports = { generateImagePath, tableForSubmissions, deleteFile };
