import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';
import { absolute, exists } from 'firost';

export const serverPort = 34495;
const servePath = absolute('<gitRoot>/lib/fixtures');
let server;

/**
 * Setup function, when all tests start
 * We start a server, to return files through HTTP
 * @returns {Promise} Promise resolving when the server is ready
 */
export async function setup() {
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
  server = http.createServer(onRequest);

  // We wait until the server is ready to receive connections on the port, or
  // stop if it errors
  return await new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(serverPort, () => {
      resolve();
    });
  });
}
/**
 * Teardown function, to run when all tests are done running
 * @returns {Promise} Promise resolving once the server is closed
 */
export async function teardown() {
  return await new Promise((resolve) => {
    server.on('close', resolve);
    server.close();
  });
}
