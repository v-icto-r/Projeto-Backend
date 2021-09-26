const express = require('express');
const bodyParser = require('body-parser');

const Store = require('./controllers/Store');
 const Sales = require('./controllers/sales');

const app = express();

app.use(bodyParser.json());

const PORT_NUMBER = 3000;
// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});
app.post('/products', Store.create);
app.get('/products', Store.getAll);
app.get('/products/:id', Store.findById);
app.put('/products/:id', Store.updateById);
app.delete('/products/:id', Store.deleteProduct);

const PORT = process.env.PORT || PORT_NUMBER;

app.listen(PORT, () => {
  console.log(`Ouvindo a porta ${PORT}`);
});