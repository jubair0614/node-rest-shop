const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders')

router.get('/', checkAuth, OrdersController.get_all_orders);
router.post('/', checkAuth, OrdersController.create_order);
router.get('/:orderID', checkAuth, OrdersController.get_one_order);
router.delete('/:orderID', checkAuth, OrdersController.delete_one_order);

module.exports = router;