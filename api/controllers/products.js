const mongoose = require('mongoose');

const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            // if (docs.length > 0) {
            res.status(200).json(response);
            // } else {
            //     res.status(404).json({
            //         message: 'No entries found!'
            //     });
            // }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err })
        });
};

exports.products_get_single_product = (req, res, next) => {
    const id = req.params.productID;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(
            doc => {
                console.log(doc);
                if (doc) {
                    res.status(200).json({
                        product: doc,
                        request: {
                            type: 'GET',
                            description: 'Get all products',
                            url: 'http://localhost:3000/products/'
                        }
                    });
                } else {
                    res.status(404).json({
                        message: 'No valid entry found for provided id'
                    });
                }
            }).catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
            });
};

exports.products_update_product = (req, res, next) => {
    const id = req.params.productID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(res => {
            res.status(200).json({
                message: 'product with id: ' + id + ' is updated.',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};

exports.products_delete_product = (req, res, next) => {
    const id = req.params.productID;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'product with id: ' + id + ' is deleted.'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};

exports.products_add_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Product created successfully',
                createdProduct: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
};