const mongoose = require('mongoose');

const Order = require('../models/order')
const Product = require('../models/product');

exports.get_all_orders = (req, res, next) => {
    Order.find()
        .select('_id product quantity')
        .populate('product', 'name')
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                }),
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            })
        });
};

exports.create_order = (req, res, next) => {
    Product.findById(req.body.productID)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productID,
                quantity: req.body.quantity
            });
            order.save()
                .then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: 'Order stored',
                        createdOrder: {
                            _id: result._id,
                            product: result.product,
                            quantity: result.quantity
                        },
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + result._id
                        }
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        message: err
                    })
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            })
        });
};

exports.get_one_order = (req, res, next) => {
    Order.findById(req.params.orderID)
        .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }
            console.log(order);
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    description: "To get all orders",
                    url: 'http://localhost:3000/orders/' + order._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            })
        });
};

exports.delete_one_order = (req, res, next) => {
    Order.remove({ _id: req.params.orderID })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted successfully',
                request: {
                    type: 'POST',
                    description: 'To post an order',
                    url: 'http://localhost:3000/orders',
                    body: { productID: "ID", quantity: "Number" }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: err
            })
        });
};