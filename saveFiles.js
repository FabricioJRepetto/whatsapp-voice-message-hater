import { ROOTDIR } from './constants.js'

export const saveFile = (args) => {
    const {
        type,
        data,
        details: {
            timestamp,
            from
        }
    } = args;

    if (!type) return

    console.log('\x1b[37m ••• saving files ••• \x1b[0m');

    const time = new Date(timestamp * 1000).toISOString().slice(0, -5).replaceAll(':', '-').replace('T', '_')
    const fileName = `${from} -audio_${time} `

    // usar writeFileSync si hay errores
    // usando writeFile se logea en consola, si no, no sale nada

    if (type === 'all' || type === 'audio') {
        //_ .ogg
        const fileBuffer = Buffer.from(data, 'base64');
        fs.writeFile(`${ROOTDIR}/${fileName}.ogg`, fileBuffer, (err) => {
            if (err) {
                console.log('\x1b[31m ❌ .ogg error \x1b[0m');
                throw err
            } else console.log('\x1b[32m ✔ .ogg done \x1b[0m');
        });

    } else if (type === 'all' || type === 'text') {
        //_ .txt
        fs.writeFile(`${ROOTDIR}/${from}_media_base64_${time}.txt`, data, (err) => {
            if (err) {
                console.log('\x1b[31m ❌ .txt error \x1b[0m');
                throw err
            } else console.log('\x1b[32m ✔ .txt done \x1b[0m');
        })
    }
}