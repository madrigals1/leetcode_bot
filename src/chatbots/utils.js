const fs = require('fs');

const puppeteer = require('puppeteer');
const uuid4 = require('uuid4');

const { log, error } = require('../utils/helper');
const { SERVER_MESSAGES } = require('../utils/dictionary');
const { CHROMIUM_PATH } = require('../utils/constants');

const generateImagePath = () => {
  // Generate uuid for image in tmp folder
  const uuid = uuid4().toString();

  return `./tmp/image_${uuid}.png`;
};

const tableForSubmissions = async (path, user) => {
  const rowHeight = 36;
  const bodyMargin = 8;

  const content = `
<html lang="en">
  <head>
    <title>{user.username}</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        margin: ${bodyMargin}px;
      }
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
      tr {
        height: ${rowHeight}px;
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
    // Set options for Puppeteer
    const options = CHROMIUM_PATH
      ? {
        args: ['--no-sandbox'],
        executablePath: CHROMIUM_PATH,
        defaultViewport: null,
      }
      : { defaultViewport: null };

    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.setViewport({
      width: 960,
      height: 760,
      deviceScaleFactor: 1,
    });
    await page.setContent(content);
    const div = await page.$('html');
    const boundingBox = await div.boundingBox();
    await div.screenshot({
      path,
      clip: {
        x: boundingBox.x,
        y: boundingBox.y,
        width: boundingBox.width,
        height: boundingBox.height,
      },
    });
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
