const router = require('express').Router();
const product=require('../controllers/products')

router.get('/', product.search);
router.get('/:id',product.getProduct);
router.post('/', product.createProduct);
router.put('/:id', product.editProduct);
router.delete('/:id', product.deletProduct);
module.exports = router;
