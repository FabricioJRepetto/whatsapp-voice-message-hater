import * as fs from 'fs';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

export const deleteFile = (path) => {
    const relativePath = path.replace(__dirname, './src').replaceAll('\\', '/')
    fs.unlink(relativePath, (err) => {
        if (err) console.log(err)
        else console.log('deleted')
    })
}