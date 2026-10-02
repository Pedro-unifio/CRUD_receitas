const list = document.querySelector('#list');
const form = document.querySelector('#form');
const message = document.querySelector('#message');
let editing = null;
async function api(url, options) {
  const res = await fetch(url, options);
  if (res.status === 204) return null;
  const body = await res.json();
  if (!res.ok) throw new Error(body.erro || 'Falha na requisição');
  return body;
}
function reset() { editing = null; form.reset(); document.querySelector('#cancel').hidden = true; document.querySelector('#form-title').textContent = 'Nova receita'; }
async function load() {
  try {
    const data = await api('/api/receitas');
    list.replaceChildren();
    if (!data.length) { const empty = document.createElement('li'); empty.textContent = 'Nenhum registro cadastrado.'; list.append(empty); }
    for (const item of data) {
      const li = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = item.nome + ' • ' + item.categoria + ' • ' + item.tempoMinutos + ' min • ' + item.porcoes + ' porções';
      const actions = document.createElement('div');
      const edit = document.createElement('button'); edit.textContent = 'Editar'; edit.type = 'button';
      edit.onclick = () => { editing = item.id; document.querySelector('#nome').value = item.nome; document.querySelector('#categoria').value = item.categoria; document.querySelector('#tempoMinutos').value = item.tempoMinutos; document.querySelector('#porcoes').value = item.porcoes; document.querySelector('#cancel').hidden = false; document.querySelector('#form-title').textContent = 'Editar receita'; window.scrollTo(0, 0); };
      const remove = document.createElement('button'); remove.textContent = 'Excluir'; remove.type = 'button';
      remove.onclick = async () => { if (!confirm('Excluir este registro?')) return; try { await api('/api/receitas/' + item.id, { method: 'DELETE' }); message.textContent = ''; reset(); await load(); } catch (error) { message.textContent = error.message; } };
      actions.append(edit, remove); li.append(label, actions); list.append(li);
    }
  } catch (error) { message.textContent = error.message; }
}
form.onsubmit = async event => {
  event.preventDefault();
  const data = { nome: document.querySelector('#nome').value, categoria: document.querySelector('#categoria').value, tempoMinutos: document.querySelector('#tempoMinutos').valueAsNumber, porcoes: document.querySelector('#porcoes').valueAsNumber };
  try { await api('/api/receitas' + (editing === null ? '' : '/' + editing), { method: editing === null ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }); message.textContent = ''; reset(); await load(); }
  catch (error) { message.textContent = error.message; }
};
document.querySelector('#cancel').onclick = reset;
load();
