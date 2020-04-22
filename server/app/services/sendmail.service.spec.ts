import * as Chai from 'chai';
import 'mocha';
import 'reflect-metadata';
import { Mail } from '../../../common/communication/email';
import { TESTMAIL } from './enum';
import { SendmailService } from './sendmail.service';

describe('Database service', () => {
    let service: SendmailService;
    const expect = Chai.expect;

    beforeEach( () => {
        service = new SendmailService();
    });

    it('should create the service', () => {
        expect(service).to.be.an('object');
    });

    it('should send an email with a image.svg', (done: Mocha.Done) => {
        const mailToSend: Mail = {
            name: 'test',
            format: 'svg',
            to: 'g.thibault@polymtl.ca',
            imgURI: TESTMAIL.URISVG
        };
        expect(async () => {
            await service.send(mailToSend);
        }).to.not.throw();
        done();
    });

    it('should send an email with a image.png', (done: Mocha.Done) => {
        // return value of file to buffer tested with the to.not.throw
        // If not in the good format, API will not accept the value
        service.fileToBuffer(TESTMAIL.URIPNGJPG);
        const mailToSend: Mail = {
            name: 'test',
            format: 'png',
            to: 'g.thibault@polymtl.ca',
            imgURI: TESTMAIL.URIPNGJPG
        };
        expect(async () => {
            await service.send(mailToSend);
        }).to.not.throw();
        done();
    });

});
