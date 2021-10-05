const { Router } = require('express');

const router = Router();

const salesController = require('../controllers/salesController');

router.post('/', salesController.addSales);

router.get('/', salesController.getAll);

router.get('/:id', salesController.getById);

router.put('/:id', salesController.updateSales);

router.delete('/:id', salesController.deleteSales);

module.exports = router;
