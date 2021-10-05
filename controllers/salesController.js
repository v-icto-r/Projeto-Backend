const salesService = require('../services/salesService');

async function getAll(_req, res) {
  const sales = await salesService.getAll();
  res.status(200).json({ sales });
}

async function getById(req, res) {
  const { id } = req.params;
  const saleById = await salesService.getById(id);

  if (saleById.message) return res.status(404).json({ err: saleById });

  res.status(200).json(saleById);
}

async function addSales(req, res) {
  const { body: salesList } = req;

  const addedSales = await salesService.addSales(salesList);

  let STATUS_CODE = 200;
  if (addedSales.message) {
    if (addedSales.code === 'stock_problem') {
      STATUS_CODE = 404;
    } else {
      STATUS_CODE = 422;
    }
    return res.status(STATUS_CODE).json({ err: addedSales });
  }

  res.status(200).json(addedSales);
}

async function updateSales(req, res) {
  const { productId, quantity } = req.body[0];
  const { id } = req.params;
  const updatedSales = await salesService.updateSales({ id, productId, quantity });

  let STATUS_CODE = 200;
  if (updatedSales.message) {
    if (updatedSales.code === 'stock_problem') {
      STATUS_CODE = 404;
    } else {
      STATUS_CODE = 422;
    }
    return res.status(STATUS_CODE).json({ err: updatedSales });
  }
  res.status(STATUS_CODE).json(updatedSales);
}

async function deleteSales(req, res) {
  const { id } = req.params;

  const deletedSale = await salesService.deleteSales(id);

  if (deletedSale.message) return res.status(422).json({ err: deletedSale });
  res.status(200).json(deletedSale);
}

module.exports = {
  getAll,
  getById,
  addSales,
  updateSales,
  deleteSales,
};
