import { absolute } from 'firost';
import config from 'aberlaas/configs/vite';

const imoenViteConfig = config;
imoenViteConfig.test.globalSetup = absolute('<gitRoot>/vite.globalSetup.js');
imoenViteConfig.test.setupFiles.push(absolute('<gitRoot>/vite.setupFile.js'));

export default imoenViteConfig;
