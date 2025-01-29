import path from 'path';
import fs from 'fs';
import http from 'http';
import { exists } from 'firost';
import serverPort from './serverPort.js';

const servePath = './fixtures';
/**
 *
 */
export default async function () {
  const onRequest = async function (request, response) {
    // We find a matching file in the fixture path, removing any query
    // string from the url
    const basename = request.url.split('?')[0].replace(/^\//, '');
    const filepath = path.resolve(servePath, basename);
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
}
