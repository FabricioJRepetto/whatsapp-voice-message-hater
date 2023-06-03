import { } from 'dotenv/config'

import qrcode from 'qrcode-terminal';
import wpjs from 'whatsapp-web.js';
const { Client, LocalAuth } = wpjs;

import { ASCII } from './constants.js'
import { printMsg } from './src/printMessage.js';
import { saveFile } from './src/saveFiles.js';
import { googleSTT } from './src/microservices/googleSpeechToText.js';
import { leopardSTT } from './src/microservices/leopardSpeechToText.js';
import { deleteFile } from './src/deleteFile.js';
import { checkMedia } from './src/checkMedia.js';

let TRANSCRIPT_MODE = 'google'

console.clear();
console.log(ASCII);
console.log('\x1b[90m                                     ••• Loggin in to Whatsapp •••\x1b[0m');

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
    console.log('\x1b[32m                                       📞 Whatsapp client ready \x1b[0m \n');
});

client.initialize();

client.on('message_create', async msg => {
    if (msg.fromMe) {
        /^#/.test(msg.body) && console.log(`\x1b[92m> ${msg.body}\x1b[0m\n`);

        if (/^#help/.test(msg.body)) {
            client.sendMessage(msg.from,
                '>> Transcript a quoted voice message: #quedice?\n>> Change transcription source: #setmode_[MODE]\nmodes:\n • google\n • leopard\n>> Check current mode: #mode'
            );

        } else if (/^#setmode_/.test(msg.body)) {
            const mode = msg.body.split('_')[1]

            if (mode === 'google') {
                TRANSCRIPT_MODE = 'google'

            } else if (mode === 'leopard') {
                TRANSCRIPT_MODE = 'leopard'

            } else {
                client.sendMessage(msg.from, 'Invalid mode');
            }
        } else if (/^#mode/.test(msg.body)) {
            client.sendMessage(msg.from, `Current transcription mode: ${TRANSCRIPT_MODE}`);

        } else if (/^#quedice\?/i.test(msg.body)) {
            msg.reply(`🤖 ya te digo...`)

            if (msg.hasQuotedMsg) {
                const original = await msg.getQuotedMessage()
                original && checkMedia(original, TRANSCRIPT_MODE)

            }
        }
    }
})

client.on('message', async msg => {
    if (!msg.isStatus && !msg.fromMe) {
        // print Message
        const { name } = await client.getContactById(msg.from)
        printMsg(msg, name)

        if (msg.hasMedia) {
            // check if media is an .ogg and trascript
            checkMedia(msg, TRANSCRIPT_MODE)
        }
    }
});
