const express = require('express');
const path = require('path');
const Model = require('./model');
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

function validate(body) {
  const data = { ...body };
  if (typeof data.nome !== 'string' || !data.nome.trim()) return 'Nome é obrigatório';
  if (typeof data.categoria !== 'string' || !data.categoria.trim()) return 'Categoria é obrigatório';
  if (typeof data.tempoMinutos !== 'number') return 'Tempo de preparo (minutos) deve ser um número';
  if (typeof data.porcoes !== 'number') return 'Número de porções deve ser um número';
  data.nome = data.nome.trim();
  data.categoria = data.categoria.trim();
  if (!Number.isInteger(data.tempoMinutos) || data.tempoMinutos < 1) return 'Tempo de preparo inválido';
  if (!Number.isInteger(data.porcoes) || data.porcoes < 1) return 'Número de porções inválido';
  return null;
}
function validId(id) { return /^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id)); }
function failure(res, error) {
  if (error.name === 'SequelizeUniqueConstraintError') return res.status(409).json({ erro: 'nome já cadastrado' });
  return res.status(500).json({ erro: 'Erro interno' });
}

app.get('/api/receitas', async (req, res) => {
  try { res.json(await Model.findAll({ order: [['id', 'ASC']] })); }
  catch (error) { failure(res, error); }
});
app.get('/api/receitas/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
  try {
    const item = await Model.findByPk(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Receita não encontrado' });
    res.json(item);
  } catch (error) { failure(res, error); }
});
app.post('/api/receitas', async (req, res) => {
  const errorText = validate(req.body);
  if (errorText) return res.status(400).json({ erro: errorText });
  try { res.status(201).json(await Model.create(req.body)); }
  catch (error) { failure(res, error); }
});
app.put('/api/receitas/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
  const errorText = validate(req.body);
  if (errorText) return res.status(400).json({ erro: errorText });
  try {
    const item = await Model.findByPk(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Receita não encontrado' });
    await item.update(req.body);
    res.json(item);
  } catch (error) { failure(res, error); }
});
app.delete('/api/receitas/:id', async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ erro: 'ID inválido' });
  try {
    const item = await Model.findByPk(req.params.id);
    if (!item) return res.status(404).json({ erro: 'Receita não encontrado' });
    await item.destroy();
    res.status(204).end();
  } catch (error) { failure(res, error); }
});
module.exports = app;
