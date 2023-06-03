import * as fs from 'fs';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const writeFile = (path, data) =>
    new Promise((resolve, reject) =>
        fs.writeFile(path, data, (err) => {
            if (err) reject(err);
            console.log('writen');
            resolve();
        })
    );

export const saveFile = async (args) => {
    try {
        const {
            includeTxt,
            data,
            details: {
                timestamp,
                from
            },
        } = args;

        let res = {
            audioPath: '',
            textPath: ''
        }

        console.log('\x1b[37m ••• saving files ••• \x1b[0m');

        const time = new Date(timestamp * 1000).toISOString().slice(0, -5).replaceAll(':', '-').replace('T', '_')
        const fileName = `${from.replace('@', '').replace('.', '')}-audio_${time}`

        // relative path
        const path = `/media/${fileName}.ogg`;

        //_ .ogg
        const fileBuffer = Buffer.from(data, 'base64');
        await writeFile('./src' + path, fileBuffer);

        // absolute path
        res.audioPath = `${__dirname}${path.replaceAll('/', '\\')}`

        //_ .txt
        // if (includeTxt) {
        //     const path = `${ROOTDIR}/${from}_media_base64_${time}.txt`

        //     await writeFile(path, data, (err) => {
        //         if (err) {
        //             console.log('\x1b[31m ❌ .txt error \x1b[0m');
        //             throw err
        //         } else {
        //             console.log('\x1b[32m ✔ .txt done \x1b[0m');
        //             res.textPath = path
        //         }
        //     })
        // }

        return res
    } catch (error) {
        console.log(err);
        return
    }
}