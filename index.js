import * as fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import qrcode from 'qrcode-terminal';
import wpjs from 'whatsapp-web.js';
const { Client, LocalAuth } = wpjs;

import { ASCII } from './constants.js'
import { printMsg } from './printMessage.js';
import { googleSTT } from './googleSpeechToText.js';
import { saveFile } from './saveFiles.js';

console.clear();
console.log(ASCII);
console.log('\x1b[90m                        ••• Loggin in to Whatsapp •••\x1b[0m');

// RemoteAuth para guardar sesión en una DB externa
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    console.log('\x1b[93m❗  QR RECEIVED \x1b[0m');
    console.log('scan to log in');
    qrcode.generate(qr, { small: true })
});

client.on('ready', () => {
    console.log('\x1b[32m                         📞 Whatsapp client ready \x1b[0m \n');
});

client.initialize();

client.on('message', async message => {
    // print Message
    printMsg(message)

    if (message.hasMedia) {
        console.log('\x1b[37m ••• checking media ••• \x1b[0m');
        const media = await message.downloadMedia();

        if (media && /audio\/ogg/g.test(media.mimetype)) {
            // Guardar archivos
            saveFile({
                // type: 'all',
                data: media.data,
                details: message
            })

            // Transcripción
            const transcription = await googleSTT(media.data)

            if (transcription) {
                message.reply(transcription);
            }

            console.log('');
        } else console.log('');
    }
});
