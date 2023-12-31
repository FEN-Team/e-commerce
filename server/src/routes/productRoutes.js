const express = require('express');
const multer = require('multer');

const {
    httpGetAllProducts,
    httpCreateProduct,
    httpGetProductById,
    httpGetAllProductsCount,
    httpEditProduct,
    httpGetAllProductsTitle
} = require('../controllers/productController');
const { fileFilter, fileStorage } = require('../utils/multer');
const { isAuth, isAdmin } = require('../middlewares/auth');
const { createOrEditProductValidator } = require('../middlewares/validators/productValidator');


const router = express.Router();

router.get('/', httpGetAllProducts);
router.post('/', isAuth, isAdmin, multer({ storage: fileStorage, fileFilter: fileFilter }).array('images', 10), createOrEditProductValidator, httpCreateProduct);
router.get('/:productId', httpGetProductById);
router.patch('/:productId', isAuth, isAdmin, createOrEditProductValidator, httpEditProduct);
router.get('/count', isAuth, isAdmin, httpGetAllProductsCount);
router.get('/title', httpGetAllProductsTitle);

module.exports = router;