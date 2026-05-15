import { Router } from 'express';
import fs from 'fs';

const apiRouter = Router();

const removeExtension = (file: string) => file.split('.').shift();

fs.readdirSync(__dirname).filter((file: string) => {
    const name = removeExtension(file);
    console.log(`route ====> ${name}`);
    if (name !== 'index') {
        const loaded = require(`./${file}`);
        const route = loaded?.default ?? loaded;
        apiRouter.use(`/${name}`, route);
    }
});

export default apiRouter;