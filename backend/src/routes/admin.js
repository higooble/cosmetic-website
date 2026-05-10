const router   = require('express').Router();
const auth     = require('../middleware/auth');
const upload   = require('../middleware/upload');
const authCtrl = require('../controllers/authController');
const banner   = require('../controllers/bannerController');
const category = require('../controllers/categoryController');
const product  = require('../controllers/productController');
const contact  = require('../controllers/contactController');
const settings = require('../controllers/settingsController');

router.post('/login', authCtrl.login);

router.use(auth);

// Banners
router.get('/banners',         (req, res, next) => { req.admin = true; next(); }, banner.getAll);
router.post('/banners',        upload.single('image'), banner.create);
router.put('/banners/:id',     upload.single('image'), banner.update);
router.delete('/banners/:id',  banner.remove);

// Categories
router.get('/categories',        (req, res, next) => { req.admin = true; next(); }, category.getAll);
router.post('/categories',       category.create);
router.put('/categories/:id',    category.update);
router.delete('/categories/:id', category.remove);

// Products
router.get('/products',                    (req, res, next) => { req.admin = true; next(); }, product.getAll);
router.post('/products',                   upload.array('images', 10), product.create);
router.put('/products/:id',                upload.array('images', 10), product.update);
router.delete('/products/:id',             product.remove);
router.delete('/products/:id/images/:imageId', product.removeImage);

// Contacts
router.get('/contacts',          contact.getAll);
router.put('/contacts/:id/read', contact.markRead);

// Site Settings
router.get('/settings',          settings.get);
router.put('/settings',          upload.single('logo'), settings.update);

module.exports = router;
