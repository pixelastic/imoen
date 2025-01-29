import { serverPort } from './vite.globalSetup.js';

globalThis.serverUrl = `http://127.0.0.1:${serverPort}`;
