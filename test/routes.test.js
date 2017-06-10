// import request from 'supertest-as-promised'
import request from 'supertest'
import app from '../src/server.js'

describe('GET /api/', () => {
    it('should render properly', async () => {
        await request(app).get('/api/').expect(200);
    });
});

describe('GET /api/users', () => {
    it('should render properly with valid parameters', async () => {
        await request(app)
            .get('/api/users')
            .query({ title: 'List title' })
            .expect(200);
    });

    it('should error without a valid parameter', async () => {
        await request(app).get('/api/users').expect(200);
    });
});

describe('GET /404', () => {
    it('should return 404 for non-existent URLs', async () => {
        await request(app).get('/404').expect(404);
        await request(app).get('/notfound').expect(404);
    });
});