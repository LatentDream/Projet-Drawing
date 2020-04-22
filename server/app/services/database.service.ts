import * as dotenv from 'dotenv';
import { injectable } from 'inversify';
import { Collection, Db, ObjectID } from 'mongodb';
import 'reflect-metadata';
import { Drawing } from './../../../common/communication/drawing';

const DATABASE_COLLECTION = 'DrawingsCollection';
// inspired from Yuri Azar's project 2 github https://github.com/yuriazar/7Diff/tree/master/server/app/services
// tslint:disable-next-line: no-var-requires tslint:disable-next-line: no-require-imports tslint:disable-next-line: ban-types
const mongo: Function = require('mongojs');

@injectable()
export class DatabaseService {

    private db: Db;

    collection: Collection<Drawing>;

    constructor() {
        dotenv.config();
        this.db = mongo(process.env.DATABASE_URL);
    }

    async saveDrawing(drawing: Drawing): Promise<string> {
        // inspired from Yuri Azar's project 2 github https://github.com/yuriazar/7Diff/tree/master/server/app/services
        // tslint:disable-next-line: ban-types
        return new Promise( (resolve: Function) => {
            const reg = new RegExp('^[\\w]{1,20}$');
            let validTags = true;
            if (drawing.tags.length > 0) {
                drawing.tags.forEach( (element: string) => {
                    if (!reg.test(element)) {
                        validTags = false;
                    }
                });
            }
            if (reg.test(drawing.name) && validTags) {
                this.db.collection(DATABASE_COLLECTION).insertOne(drawing);
                resolve('drawing saved');
            } else {
                resolve('drawing not saved');
            }
        });
    }

    async getAllDrawings(): Promise<Drawing[]> {
        // inspired from Yuri Azar's project 2 github https://github.com/yuriazar/7Diff/tree/master/server/app/services
        // tslint:disable-next-line: ban-types
        return new Promise( (resolve: Function) => {
            const drawings: Drawing[] = [];
            this.db.collection(DATABASE_COLLECTION).find().toArray((err: Error, res: Drawing[]) => {
                if (err) {throw err; }
                for (const draw of res) {
                    drawings.push(draw);
                }
                resolve(drawings);
            });
        });
    }

    async removeDrawing(id: string): Promise<string> {
        // inspired from Yuri Azar's project 2 github https://github.com/yuriazar/7Diff/tree/master/server/app/services
        // tslint:disable-next-line: ban-types
        return new Promise( (resolve: Function) => {
            // tslint:disable-next-line: deprecation
            this.db.collection(DATABASE_COLLECTION).remove({ _id: new ObjectID(id)});
            resolve('drawing deleted');
        });
    }
}
