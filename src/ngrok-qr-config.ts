import * as fs from 'fs';


type NgrokQrConfig = {
    authToken: string,
}

const writeConfig = (config: NgrokQrConfig) => {
    const path = process.env.PROGRAMDATA + '/ngrokqr/.config';
    if (!fs.existsSync(path)) {
        fs.mkdirSync(process.env.PROGRAMDATA + '/ngrokqr');
    }
    fs.writeFileSync(path, JSON.stringify(config, null, 2));
}

const readConfig = (): NgrokQrConfig => {
    const path = process.env.PROGRAMDATA + '/ngrokqr/.config';
    if (fs.existsSync(path)) {
        const data = fs.readFileSync(path, { encoding: 'utf-8' });
        return JSON.parse(data) as NgrokQrConfig;
    }
    return { authToken: '' }
}

export {
    NgrokQrConfig,
    writeConfig,
    readConfig
}