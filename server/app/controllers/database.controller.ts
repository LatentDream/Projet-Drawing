import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Drawing } from '../../../common/communication/drawing';
import { DatabaseService } from '../services/database.service';
import Types from '../types';

@injectable()
export class DatabaseController {
    router: Router;

    constructor(
        @inject(Types.DatabaseService) private databaseService: DatabaseService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/drawing/', async (req: Request, res: Response, next: NextFunction) => {
            console.log(req.body);
            this.databaseService.saveDrawing(req.body)
                .then((value) => {
                    res.send(value);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.get('/drawings', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.getAllDrawings()
                .then((drawings: Drawing[]) => {
                    res.send(drawings);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });

        this.router.delete('/remove/' + ':drawingname', async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.removeDrawing(req.params.drawingname)
            .then((value) => {
                res.send(value);
            })
            .catch((error: Error) => {
                res.status(Httpstatus.NOT_FOUND).send(error.message);
            });
        });
    }
}
