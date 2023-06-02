
import speech from '@google-cloud/speech';

import { } from 'dotenv/config'

const client = new speech.SpeechClient();

export const googleSTT = async (data) => {
    console.log('\x1b[37m ••• trascribing audio ••• \x1b[0m');

    const audio = {
        content: data,
    };
    const config = {
        encoding: 'OGG_OPUS',
        sampleRateHertz: 16000,
        languageCode: 'es-AR',
        enableAutomaticPunctuation: true
    };
    const request = {
        audio: audio,
        config: config,
    };

    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

    console.log(`\x1b[37m Audio: ${transcription} \x1b[0m`);
    return transcription
}