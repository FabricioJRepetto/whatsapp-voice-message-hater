import { googleSTT } from "./microservices/googleSpeechToText.js";
import { leopardSTT } from "./microservices/leopardSpeechToText.js";
import { saveFile } from "./saveFiles.js";
import { deleteFile } from "./deleteFile.js";

export const checkMedia = async (msg, TRANSCRIPT_MODE) => {
    console.log('\x1b[37m ••• checking media ••• \x1b[0m');
    const media = await msg.downloadMedia();

    if (media && /audio\/ogg/g.test(media.mimetype)) {
        if (TRANSCRIPT_MODE === 'google') {
            // Transcription by base64
            let transcription = await googleSTT(media.data)
            if (transcription) {
                msg.reply(`_${transcription}_\n 🕶`);
            }

        } else {
            // Save file
            const { audioPath } = await saveFile({
                data: media.data,
                details: msg
            })

            if (audioPath) {
                // Transcription by file
                let transcription = leopardSTT(audioPath)
                if (transcription) {
                    msg.reply(`_${transcription}_\n 🦁`);
                }
                // Delete file
                deleteFile(audioPath)
            }
        }
    }
}