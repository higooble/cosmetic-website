const router   = require('express').Router();
const banner   = require('../controllers/bannerController');
const category = require('../controllers/categoryController');
const product  = require('../controllers/productController');
const contact  = require('../controllers/contactController');
const settings = require('../controllers/settingsController');

router.get('/banners',        banner.getAll);
router.get('/categories',     category.getAll);
router.get('/products',       product.getAll);
router.get('/products/:id',   product.getOne);
router.post('/contact',       contact.submit);
router.get('/settings',       settings.get);

module.exports = router;
