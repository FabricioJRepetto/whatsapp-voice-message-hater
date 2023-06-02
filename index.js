import * as fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import qrcode from 'qrcode-terminal';
import wpjs from 'whatsapp-web.js';
const { Client, LocalAuth } = wpjs;

import { ASCII } from './constants.js'
import { printMsg } from './src/printMessage.js';
import { saveFile } from './src/saveFiles.js';
import { googleSTT } from './src/microservices/googleSpeechToText.js';

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

client.on('message_create', async msg => {
    if (msg.fromMe) {
        // const contacts = await client.getContactById('5491156381802@c.us')
        // console.log(contacts);
        // console.log(contacts?.name);
    }
})

client.on('message', async msg => {

    if (!msg.isStatus) {
        // print Message
        const { name } = await client.getContactById('5491156381802@c.us')
        printMsg(msg, name)

        if (msg.hasMedia) {
            console.log('\x1b[37m ••• checking media ••• \x1b[0m');
            const media = await msg.downloadMedia();

            if (media && /audio\/ogg/g.test(media.mimetype)) {
                // Guardar archivos
                saveFile({
                    // type: 'all',
                    data: media.data,
                    details: msg
                })

                // Transcripción
                const transcription = await googleSTT(media.data)

                if (transcription) {
                    msg.reply(transcription);
                }

                console.log('');
            } else console.log('');
        }
    }
});
