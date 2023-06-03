import { Leopard } from "@picovoice/leopard-node";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const accessKey = process.env.LEOPARD_API_KEY;
const handle = new Leopard(accessKey, { modelPath: __dirname + '\\assets\\leopard_params_es.pv' });
// const handle = new Leopard(accessKey);

export const leopardSTT = (path) => {
    if (!path) return
    console.log('\x1b[37m ••• trascripting audio (leopard) ••• \x1b[0m');

    try {
        const result = handle.processFile(path);
        console.log(`\x1b[37m ${result.transcript} \x1b[0m`);

        return result.transcript

    } catch (error) {
        console.log(error);
    }
}