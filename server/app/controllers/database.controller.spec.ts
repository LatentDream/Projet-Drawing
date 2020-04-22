
import { expect } from 'chai';
import * as supertest from 'supertest';
import { Stubbed, testingContainer } from '../../test/test-utils';
import { Application } from '../app';
import { DatabaseService } from '../services/database.service';
import Types from '../types';
import { Drawing } from './../../../common/communication/drawing';

const HTTP_STATUS_OK = 200;
const HTTP_STATUS_NOT_FOUND = 404;

describe('DatabaseController', () => {
  let databaseService: Stubbed<DatabaseService>;
  let app: Express.Application;

  beforeEach(async () => {
      const [container, sandbox] = await testingContainer();
      container.rebind(Types.DatabaseService).toConstantValue({
          getAllDrawings: sandbox.stub(),
          saveDrawing: sandbox.stub(),
          removeDrawing: sandbox.stub()

      });
      databaseService = container.get(Types.DatabaseService);
      app = container.get<Application>(Types.Application).app;
  });

  it('should return succes as a message on database/drawings/', async () => {
    const drawing: Drawing = {_id: 'anid',
            name: 'validregexname',
            tags: ['validregex', 'validregex'],
            drawing: 'somedrawing'};
    databaseService.getAllDrawings.resolves(drawing);

    return supertest(app)
        .get('/database/drawings/')
        .expect(HTTP_STATUS_OK)
        // tslint:disable-next-line: no-any
        .then((response: any) => {
            expect(response.body).to.deep.equal(drawing);
        });
  });

  it('should return an error as a message on database/drawings/', async () => {
    databaseService.getAllDrawings.rejects();

    return supertest(app)
        .get('/database/drawings/')
        // tslint:disable-next-line: no-any
        .then((response: any) => {
          expect(response.status).to.equal(HTTP_STATUS_NOT_FOUND);
      });
  });

  it('should return drawing saved as a message on /database/drawing/', async () => {
    databaseService.saveDrawing.resolves('drawing saved');

    return supertest(app)
        .post('/database/drawing/')
        .expect('drawing saved')
        // tslint:disable-next-line: no-any
        .then((response: any) => {
            expect(response.status).to.equal(HTTP_STATUS_OK);
        });
  });

  it('should return drawing not saved as a message on /database/drawing/', async () => {
    databaseService.saveDrawing.resolves('drawing not saved');

    return supertest(app)
        .post('/database/drawing/')
        .expect('drawing not saved')
        // tslint:disable-next-line: no-any
        .then((response: any) => {
            expect(response.status).to.equal(HTTP_STATUS_OK);
        });
  });

  it('should return error on error on /database/drawing/', async () => {
    databaseService.saveDrawing.rejects();

    return supertest(app)
        .post('/database/drawing/')
        // tslint:disable-next-line: no-any
        .then((response: any) => {
            expect(response.status).to.equal(HTTP_STATUS_NOT_FOUND);
        });
  });

  it('should return drawing deleted as a message on service /database/remove/:id', async () => {
    databaseService.removeDrawing.resolves('drawing deleted');

    return supertest(app)
        .delete('/database/remove/:id')
        .expect('drawing deleted')
        // tslint:disable-next-line: no-any
        .then((response: any) => {
            expect(response.status).to.equal(HTTP_STATUS_OK);
        });
  });

  it('should return drawing deleted as a message on service /database/remove/:id', async () => {
    databaseService.removeDrawing.rejects();

    return supertest(app)
        .delete('/database/remove/:id')
        .expect('Error')
        // tslint:disable-next-line: no-any
        .then((response: any) => {
            expect(response.status).to.equal(HTTP_STATUS_NOT_FOUND);
        });
  });

});
