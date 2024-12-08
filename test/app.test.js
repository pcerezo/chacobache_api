const request = require('supertest');
const app = require('../index'); // Tu archivo principal de Express
jest.useFakeTimers();

test('GET /api/test/saludo devuelve un mensaje de bienvenida', async () => {
  const res = await request(app).get('/api/test/saludo');
  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBe('Hello World');
});