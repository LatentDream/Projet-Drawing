import * as Chai from 'chai';
import 'mocha';
import 'reflect-metadata';
import { Drawing } from './../../../common/communication/drawing';
import { DatabaseService } from './database.service';

describe('Database service', () => {
    let service: DatabaseService;
    const expect = Chai.expect;

    beforeEach( () => {
        service = new DatabaseService();
    });

    it('should create the service', (done: Mocha.Done) => {
        expect(service).to.be.an('object');
        done();
    });

    it('should save drawing to database', (done: Mocha.Done) => {
        const drawing: Drawing = {_id: 'anid',
            name: 'validregexname',
            tags: ['validregex', 'validregex'],
            drawing: 'somedrawing'};

        expect(() => {
                     service.saveDrawing(drawing);
                }).to.not.throw();
        done();
    });

    it('should save drawing to database and return drawing saved', (done: Mocha.Done) => {
        const drawing: Drawing = {_id: 'anid',
            name: 'validregexname',
            tags: ['validregex', 'validregex'],
            drawing: 'somedrawing'};

        service.saveDrawing(drawing).then((result: string) => {
            expect(result).to.equals('drawing saved');
            done();
        });
    });

    it('should not save drawing to database and return drawing not saved (name issue)', (done: Mocha.Done) => {
        const drawing: Drawing = {_id: 'anid',
            name: 'not validregexname',
            tags: ['validregex', 'validregex'],
            drawing: 'somedrawing'};

        service.saveDrawing(drawing).then((result: string) => {
            expect(result).to.equals('drawing not saved');
            done();
        });
    });

    it('should not save drawing to database and return drawing not saved (tags issue)', (done: Mocha.Done) => {
        const drawing: Drawing = {_id: 'anid',
            name: 'validregexname',
            tags: ['validregex', 'not validregex'],
            drawing: 'somedrawing'};

        service.saveDrawing(drawing).then((result: string) => {
            expect(result).to.equals('drawing not saved');
            done();
        });
    });

    it('should save drawing to database and return drawing saved (0 tags)', (done: Mocha.Done) => {
        const drawing: Drawing = {_id: 'anid',
            name: 'validregexname',
            tags: [],
            drawing: 'somedrawing'};

        service.saveDrawing(drawing).then((result: string) => {
            expect(result).to.equals('drawing saved');
            done();
        });
    });

    it('should not throw on getAllDrawings', (done: Mocha.Done) => {
        expect(() => {
                    service.getAllDrawings();
                }).to.not.throw();
        done();
    });

    it('should return an array of drawings', (done: Mocha.Done) => {
        service.getAllDrawings().then((result: Drawing[]) => {
            expect(result).to.be.an('array');
            done();
        });
    });

    it('should remvove a drawing from the database', (done: Mocha.Done) => {
        service.removeDrawing('5e580d366b252428d92b8838').then((result: string) => {
            expect(result).to.equals('drawing deleted');
            done();
        });
    });
});
