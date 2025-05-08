const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Express app in index.js
const Event = require('../src/models/event');
const Expense = require('../src/models/expense');

describe('Expense API Integration Tests', () => {
  let eventId;

  beforeAll(async () => {
    // Vytvoření testovací události
    const evt = await Event.create({
      name: 'Testovací událost',
      date: new Date(Date.now() + 3600 * 1000),
      location: 'Test',
      description: '',
      budget: 1000
    });
    eventId = evt._id.toString();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('POST /api/expense/create – valid data', async () => {
    const resp = await request(app)
      .post('/api/expense/create')
      .send({
        eventId,
        title: 'Catering',
        amount: 500,
        date: new Date().toISOString()
      })
      .expect(201);
    expect(resp.body).toHaveProperty('_id');
    expect(resp.body.amount).toBe(500);
  });

  test('POST /api/expense/create – missing fields', async () => {
    const resp = await request(app)
      .post('/api/expense/create')
      .send({ eventId })
      .expect(400);
    expect(resp.body.code).toMatch(/dtoInIsNotValid$/);
  });

  test('PUT /api/expense/update – update amount', async () => {
    const createRes = await request(app)
      .post('/api/expense/create')
      .send({
        eventId,
        title: 'Drink',
        amount: 100,
        date: new Date().toISOString()
      });
    const expId = createRes.body._id;
    const resp = await request(app)
      .put('/api/expense/update')
      .send({ id: expId, amount: 150 })
      .expect(200);
    expect(resp.body.amount).toBe(150);
  });

  test('DELETE /api/expense/remove – remove expense', async () => {
    const createRes = await request(app)
      .post('/api/expense/create')
      .send({
        eventId,
        title: 'Snack',
        amount: 50,
        date: new Date().toISOString()
      });
    const expId = createRes.body._id;
    await request(app)
      .delete('/api/expense/remove')
      .send({ id: expId })
      .expect(200)
      .expect({});
  });
});
