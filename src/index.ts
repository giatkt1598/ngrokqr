#!/usr/bin/env node

import * as inquirer from "inquirer";
import * as yargs from 'yargs';
import * as ngrok from 'ngrok';
import * as qrcode from 'qrcode-terminal';
import { readConfig, writeConfig } from "./ngrok-qr-config";

inquirer.prompt([
    {
        name: 'authtoken',
        type: 'input',
        when: () => false
    },
    {
        name: 'config',
        type: 'input',
        when: () => false,
    }
]).then(async (answers: any) => {
    answers = Object.assign({}, answers, yargs.argv);
    const params: string[] = answers['_'];
    const authToken = answers['authtoken'];
    const isShowConfig = Boolean(answers['config']);

    const config = readConfig();
    if (isShowConfig) {
        console.log([
            `***Config***`,
            `- AuthToken: ${config.authToken || '<Not Found>'}`,
            `---------------------------`,
        ].join("\r\n"));
        return;
    }

    if (authToken) {
        config.authToken = authToken;
        writeConfig(config);
        console.log('Update AuthToken success.');
    };

    if (config.authToken) {
        await ngrok.authtoken(config.authToken);
    }

    const hostOrPort: any = params[0];

    if (hostOrPort) {

        const url = await ngrok.connect(hostOrPort);

        const code = await new Promise(resolve =>
            qrcode.generate(url, { small: true }, qr => resolve(qr))
        );

        const output = [
            `> ngrok http ${hostOrPort}`,
            `> ${url}`,
            code,
            `(Ctrl + C to close)`,
        ].join("\r\n");

        console.log(output);
    }
})

