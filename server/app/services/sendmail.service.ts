import * as dotenv from 'dotenv';
import { injectable } from 'inversify';
import 'reflect-metadata';
import * as request from 'request';
import { Mail } from './../../../common/communication/email';

@injectable()
export class SendmailService {

    fileToBuffer(dataURL: string): Buffer {
        const buffer = Buffer.from((dataURL.split(',')[1]), 'base64');
        return buffer;
    }

    async send(mail: Mail): Promise<string> {
        dotenv.config();
        // tslint:disable-next-line: ban-types
        return new Promise( (resolve: Function) => {

            let fileContent: Buffer | string = mail.imgURI;
            if (mail.format !== 'svg') { fileContent = this.fileToBuffer(fileContent); }

            const options = {
                method: 'POST',
                url: 'https://log2990.step.polymtl.ca/email?address_validation=true&quick_return=false',
                headers: {
                    'X-Team-Key': process.env.KEY_API_MAIL,
                    'Content-Type': 'multipart/form-data'
                },
                formData: {
                    to: mail.to,
                    payload: {
                        value: fileContent,
                        options: {
                            filename: mail.name + '.' + mail.format,
                            contentType: null
                        }
                    }
                }
            };
            request(options, (error: string | undefined, response: { body: string; }) => {
                console.log(response.body);
                resolve(response.body);
            });
        });
    }
}
