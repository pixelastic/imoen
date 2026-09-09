import { gitRoot } from 'firost';
import config from 'aberlaas/configs/vite';

const imoenViteConfig = config;
imoenViteConfig.test.globalSetup = `${gitRoot()}/vite.globalSetup.js`;
imoenViteConfig.test.setupFiles.push(`${gitRoot()}/vite.setupFile.js`);

export default imoenViteConfig;
