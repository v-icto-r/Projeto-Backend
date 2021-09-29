const express = require('express');
const bodyParser = require('body-parser');
const {
  productsRoutes,
  salesRoutes,
} = require('./routes');

const app = express();
//   expect(response).to.

const PORT_NUMBER = 3000;
const PORT = process.env.PORT || PORT_NUMBER;

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/products', productsRoutes);
app.use('/sales', salesRoutes);

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.listen(PORT_NUMBER, () => console.log(`Server is running on port ${PORT}!`));