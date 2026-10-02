process.env.DB_PATH = ':memory:';
const request = require('supertest');
const database = require('../src/database');
const Model = require('../src/model');
const app = require('../src/app');
const url = '/api/receitas';
const sample = {"nome": "Bolo de cenoura", "categoria": "Sobremesa", "tempoMinutos": 45, "porcoes": 8};
const updated = {"nome": "Bolo de cenoura com cobertura", "categoria": "Sobremesa", "tempoMinutos": 50, "porcoes": 10};
beforeEach(async () => database.sync({ force: true }));
afterAll(async () => database.close());

test('interface é acessível', async () => {
  const res = await request(app).get('/');
  expect(res.status).toBe(200);
  expect(res.text).toContain('Caderno de receitas');
});
test('cria, lista, consulta, atualiza e exclui registro persistido', async () => {
  const created = await request(app).post(url).send(sample);
  expect(created.status).toBe(201);
  const id = created.body.id;
  expect(id).toEqual(expect.any(Number));
  expect((await request(app).get(url)).body).toHaveLength(1);
  expect((await request(app).get(url + '/' + id)).body).toMatchObject(sample);
  expect((await request(app).put(url + '/' + id).send(updated)).status).toBe(200);
  expect((await request(app).get(url + '/' + id)).body).toMatchObject(updated);
  expect((await request(app).delete(url + '/' + id)).status).toBe(204);
  expect((await request(app).get(url + '/' + id)).status).toBe(404);
});
test('recusa IDs inválidos, ausentes e dados inválidos', async () => {
  for (const method of ['get','put','delete']) {
    expect((await request(app)[method](url + '/abc').send(sample)).status).toBe(400);
    expect((await request(app)[method](url + '/1').send(sample)).status).toBe(404);
  }
  expect((await request(app).post(url).send({"nome": "Bolo de cenoura", "categoria": "X", "tempoMinutos": 0, "porcoes": 8})).status).toBe(400);
  expect((await request(app).post(url).send({})).status).toBe(400);
  const created = await request(app).post(url).send(sample);
  expect((await request(app).put(url + '/' + created.body.id).send({"nome": "Bolo de cenoura", "categoria": "X", "tempoMinutos": 0, "porcoes": 8})).status).toBe(400);
});
test('campo único não aceita duplicatas', async () => {
  await request(app).post(url).send(sample);
  const res = await request(app).post(url).send(sample);
  expect(res.status).toBe(409);
  expect(res.body.erro).toContain('já cadastrado');
});
test('falhas inesperadas retornam 500', async () => {
  const find = jest.spyOn(Model, 'findAll').mockRejectedValueOnce(new Error('segredo do banco'));
  const res = await request(app).get(url);
  expect(res.status).toBe(500);
  expect(JSON.stringify(res.body)).not.toContain('segredo do banco');
  find.mockRestore();
});

test('falhas de consulta, criação, atualização e exclusão são tratadas', async () => {
  const created = await request(app).post(url).send(sample);
  for (const [method, suffix, modelMethod] of [
    ['get', '/' + created.body.id, 'findByPk'],
    ['post', '', 'create'],
    ['put', '/' + created.body.id, 'findByPk'],
    ['delete', '/' + created.body.id, 'findByPk']
  ]) {
    const spy = jest.spyOn(Model, modelMethod).mockRejectedValueOnce(new Error('privado'));
    const result = await request(app)[method](url + suffix).send(sample);
    expect(result.status).toBe(500);
    expect(JSON.stringify(result.body)).not.toContain('privado');
    spy.mockRestore();
  }
});
