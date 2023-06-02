const fs = require('fs')
const path = require('path')

export const base64FileToFile = (arg = false) => {
    const time = new Date().toISOString().slice(0, -5).replaceAll(':', '-').replace('T', '_'),
        fileName = `test_file_${time}`,
        uri = path.join(__dirname, 'assets', 'audio.txt')

    const str = arg || fs.readFileSync(uri, 'utf-8', (err, data) => {
        if (!err) {
            return data.toString()
        }
    })

    //_ to .txt
    // fs.writeFile(`./media/Test_base64_${time}.txt`, str, (err) => {
    //     if (err) {
    //         console.log('\x1b[31m ❌ .ogg done \x1b[0m');
    //         throw err
    //     } else console.log('\x1b[32m ✔ .txt done \x1b[0m');
    // })

    //_ to file
    const fileBuffer = Buffer.from(str, 'base64');
    fs.writeFile(`./media/${fileName}.ogg`, fileBuffer, (err) => {
        if (err) {
            console.log('\x1b[31m ❌ .ogg done \x1b[0m');
            throw err
        } else console.log('\x1b[32m ✔ .ogg done \x1b[0m');
    });
}