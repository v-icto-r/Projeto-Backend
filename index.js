const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

const productsRouter = require('./routers/productsRouter');

app.use('/products', productsRouter);

const salesRouter = require('./routers/salesRouter');

app.use('/sales', salesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
