import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);

const request = chai.request;
const  expect = chai.expect;

describe('App Setup', () => {
    it('should server static files from the /public folder', (done) =>{
        request(app)
            .get('/index.html')
            .end((err: any, res: ChaiHttp.Response) => {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
                done();
            });
    });

    it('should have the required middleware and routes', (done) => {
        request(app)
            .get('/api')
            .end((err: any, res: ChaiHttp.Response) => {
                expect(res).to.have.status(404)
                done();
            });
    });
});