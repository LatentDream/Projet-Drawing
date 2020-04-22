import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { SendmailService } from '../services/sendmail.service';
import Types from '../types';

@injectable()
export class SendmailController {
    router: Router;

    constructor(
        @inject(Types.SendmailService) private sendmailService: SendmailService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        this.router.post('/fromServer/', async (req: Request, res: Response, next: NextFunction) => {
            this.sendmailService.send(req.body)
                .then((resApi: string) => {
                    const resApiObject = JSON.parse(resApi);
                    const regEmailInvalid = new RegExp('^Key');
                    const regEmailQuota = new RegExp('^You have exceeded your hourly quota.');

                    if (resApiObject.message) {
                        res.send({message: 'Un couriel a été envoyé'});
                    } else if (regEmailInvalid.test(resApiObject.error)) {
                        res.send({message: 'Couriel invalide'});
                    } else if (regEmailQuota.test(resApiObject.error)) {
                        res.send({message: 'Quota de couriel attente pour l\'heure'});
                    } else {
                        res.send({message: 'Erreur serveur'});
                    }
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });
    }
}
