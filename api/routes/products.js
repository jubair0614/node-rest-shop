const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null, true);
    else cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', ProductController.products_get_all);

router.get('/:productID', ProductController.products_get_single_product);

router.patch('/:productID', checkAuth, ProductController.products_update_product);

router.delete('/:productID', checkAuth, ProductController.products_delete_product);

router.post('/', checkAuth, upload.single('productImage'), ProductController.products_add_product);

module.exports = router;