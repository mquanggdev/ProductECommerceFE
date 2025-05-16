const Product = require("../../models/products.model");
const Category = require("../../models/category.model");
const { category } = require("../home.controller");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 4;
        const skip = (page - 1) * limit;

        // Truy vấn sản phẩm 
        const products = await Product
            .find()
            .sort({ position: "desc" })
            .skip(skip)
            .limit(limit)
            .lean();

        for (const item of products) {
            item.priceNew = ((1 - item.discountPercentage / 100) * item.price).toFixed(0);
        }
        const totalNew = await Product.countDocuments({
            deleted: false,
        });

        res.status(200).json({
            success: true,
            data: {
                products,
                pagination: {
                    page,
                    limit,
                    totalNew,
                    totalPagesNew: Math.ceil(totalNew / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


// [POST] /admin/products/createPr
module.exports.createPr = async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            description: req.body.description,
            category_id: req.body.category_id,
            price: parseInt(req.body.price),
            discountPercentage: parseInt(req.body.discountPercentage),
            stock: parseInt(req.body.stock),
            thumbnail: req.body.thumbnail,
            position: parseInt(req.body.position), // FE tự đánh số thứ tự tăng dần , logic rất dễ
            status: req.body.status,
        }

        const newPr = new Product(data);
        await newPr.save();

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


// // [PATCH] /admin/products/updatePr/1293948457573493(id) - dãy id này fe phải gắn lên 
module.exports.updatePr = async (req, res) => {
    try {
        const idProduct = req.params.id;
        if (!idProduct) {
            res.status(403).json({
                success: false,
                message: "Sản phẩm đang truy vấn không tồn tại"
            });
        }

        const data = {
            title: req.body.title,
            description: req.body.description,
            category_id: req.body.category_id,
            price: parseInt(req.body.price),
            discountPercentage: parseInt(req.body.discountPercentage),
            stock: parseInt(req.body.stock),
            thumbnail: req.body.thumbnail,
            position: parseInt(req.body.position),
            status: req.body.status,
        }

        await Product.updateOne({
            _id: idProduct
        }, {
            ...data
        })

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


// // [PATCH] /admin/products/deletePr/1293948457573493
module.exports.deletePr = async (req, res) => {
    try {
        const idProduct = req.params.id;
        if (!idProduct) {
            res.status(403).json({
                success: false,
                message: "Sản phẩm đang truy vấn không tồn tại"
            });
        }

        await Product.updateOne({
            _id: idProduct
        }, {
            deleted: true
        })
        res.status(200).json({
            success: true,
            message: "Delete Success"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// // [Get] /admin/products/detailPr/1293948457573493
module.exports.detailPr = async (req, res) => {
    try {
        const idProduct = req.params.id;
        if (!idProduct) {
            res.status(403).json({
                success: false,
                message: "Sản phẩm đang truy vấn không tồn tại"
            });
        }

        const data = await Product.findOne({
            _id: idProduct
        })
        res.status(200).json({
            success: true,
            message: "Delete Success",
            data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};