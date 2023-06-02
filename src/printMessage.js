export const printMsg = (message, name) => {
    //: TODO print audiowave

    const {
        _data: {
            notifyName: from,
        },
        body,
        timestamp,
        type
    } = message;

    const types = {
        ptt: '🎤',
        audio: '🔊',
        image: '📷'
    }

    // print Message
    console.log(`\x1b[36m▶ ${name} (${from}) \x1b[0m
    ${body || types[type] || '-'}
    \x1b[90m ${new Date(timestamp * 1000).toLocaleTimeString()}${!body ? ', ' + type : ''} \x1b[0m`);
}