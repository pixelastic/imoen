const path = require('path');
const fs = require('fs');
const http = require('http');
const exists = require('firost/exists');
const serverPort = require('./serverPort.js');

const servePath = './fixtures';
module.exports = async function () {
  const onRequest = async function (request, response) {
    // We find a matching file in the fixture path, removing any query
    // string from the url
    const filepath = path.join(servePath, request.url.split('?')[0]);
    // If file does not exist, we return a 404
    if (!(await exists(filepath))) {
      response.writeHead(404);
      response.end();
      return;
    }

    // We return the file content
    const extname = path.extname(filepath).replace('.', '');
    const readStream = fs.createReadStream(filepath);
    readStream.on('open', function () {
      response.setHeader('Content-Type', `image/${extname}`);
      readStream.pipe(response);
    });
  };
  const server = http.createServer(onRequest);

  // We wait until the server is ready to receive connections on the port, or
  // stop if it errors
  return await new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(serverPort, () => {
      global.server = server;
      resolve();
    });
  });
};
