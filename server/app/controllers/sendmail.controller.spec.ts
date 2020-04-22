
import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import Types from '../types';
import { SendmailService } from './../services/sendmail.service';

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_NOT_FOUND = 404;
const SENDMAILPATH = '/sendmail/fromServer';

describe('DatabaseController', () => {
  let sendmailService: Stubbed<SendmailService>;
  let app: Express.Application;

  beforeEach(async () => {
      const [container, sandbox] = await testingContainer();
      container.rebind(Types.SendmailService).toConstantValue({
          send: sandbox.stub()
      });
      sendmailService = container.get(Types.SendmailService);
      app = container.get<Application>(Types.Application).app;
  });

  it('should return succes as a message on /sendmail/fromServer', async () => {
    sendmailService.send.resolves('{"message": "an email as been send"}');

    return supertest(app)
        .post(SENDMAILPATH)
        .expect(HTTP_STATUS_OK)
        // tslint:disable-next-line: no-any
        .then((response: any) => {
            expect(response.body).to.deep.equal({message: 'Un couriel a été envoyé'});
        });
  });

  it('should return message saying the email is not valid on /sendmail/fromServer when email not valid', async () => {
    sendmailService.send.resolves('{"error": "Key "}');

    return supertest(app)
        .post(SENDMAILPATH)
        .expect(HTTP_STATUS_OK)
        // tslint:disable-next-line: no-any
        .then((response: any) => {
            expect(response.body).to.deep.equal({message: 'Couriel invalide'});
        });
  });

  it('should return message saying the email is not valid on /sendmail/fromServer when email not valid', async () => {
    sendmailService.send.resolves('{"error": "You have exceeded your hourly quota."}');

    return supertest(app)
        .post(SENDMAILPATH)
        .expect(HTTP_STATUS_OK)
        // tslint:disable-next-line: no-any
        .then((response: any) => {
            expect(response.body).to.deep.equal({message: 'Quota de couriel attente pour l\'heure'});
        });
  });

  it('should return an error as a message on /sendmail/fromServer when these a internal error', async () => {
    sendmailService.send.resolves('{"detail": "..."}');

    return supertest(app)
        .post(SENDMAILPATH)
        .expect(HTTP_STATUS_OK)
        // tslint:disable-next-line: no-any
        .then((response: any) => {
            expect(response.body).to.deep.equal({message: 'Erreur serveur'});
        });
  });

  it('should return error on error on /database/drawing/', async () => {
    sendmailService.send.rejects();

    return supertest(app)
        .post(SENDMAILPATH)
        // tslint:disable-next-line: no-any
        .then((response: any) => {
            expect(response.status).to.equal(HTTP_STATUS_NOT_FOUND);
        });
  });
});
