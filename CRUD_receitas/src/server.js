const database = require('./database');
require('./model');
const app = require('./app');
database.sync().then(() => app.listen(process.env.PORT || 3001, () => console.log('Servidor disponível em http://localhost:' + (process.env.PORT || 3001)))).catch(error => { console.error(error); process.exitCode = 1; });
