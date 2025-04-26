const Product = require("../models/products.model");
const Category = require("../models/category.model");

// [GET] /
module.exports.index = async (req, res) => {
    try {
        // Lấy tham số page và limit từ query (mặc định page=1, limit=6)  có dạng ?page=1&limit=6 .
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;
        // Truy vấn các danh mục sản phẩm
        const categories = await Category.find({
            deleted : false
        }).select("title slug")

        // Truy vấn sản phẩm nổi bật
        const productsFeatured = await Product
            .find({
                featured: "1",
                deleted: false
            })
            .sort({ position: "desc" })
            .skip(skip)
            .limit(limit)
            .lean();
        for (const item of productsFeatured) {
            item.priceNew = ((1 - item.discountPercentage / 100) * item.price).toFixed(0);
        }

        // Truy vấn sản phẩm mới
        const productsNew = await Product
            .find({
                deleted: false,
            })
            .sort({ position: "desc" })
            .skip(skip)
            .limit(limit)
            .lean();

        for (const item of productsNew) {
            item.priceNew = ((1 - item.discountPercentage / 100) * item.price).toFixed(0);
        }

        // Tính tổng số sản phẩm để trả về thông tin phân trang
        const totalFeatured = await Product.countDocuments({
            featured: "1",
            deleted: false
        });
        const totalNew = await Product.countDocuments({
            deleted: false,
        });

        res.status(200).json({
            success: true,
            data: {
                categories,
                productsFeatured,
                productsNew,
                pagination: {
                    page,
                    limit,
                    totalFeatured,
                    totalNew,
                    totalPagesFeatured: Math.ceil(totalFeatured / limit),
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


// [GET] /category/:slugCategory
module.exports.category = async (req , res) => {
    try {
        // Lấy tham số page, limit và slugCategory // category/thoi-trang-meo?page=1&limit=12
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const slugCategory = req.params.slugCategory;

        // Kiểm tra slugCategory
        if (!slugCategory) {
            return res.status(400).json({
                status: "error",
                message: "Vui lòng gửi kèm slugCategory",
            });
        }

        // Tìm danh mục theo slug
        const category = await Category.findOne({ slug: slugCategory });
        if (!category) {
            return res.status(404).json({
                status: "error",
                message: "Danh mục không tồn tại",
            });
        }

        // Tìm sản phẩm thuộc danh mục
        const productList = await Product.find({
            category_id: category.id,
            deleted: false
        })
            .sort({ position: "desc" })
            .skip(skip)
            .limit(limit)
            .select("-description")
            .lean();

        // Tính giá sau giảm giá
        for (const item of productList) {
            item.priceNew = ((1 - item.discountPercentage / 100) * item.price).toFixed(0);
        }

        // Tính tổng số sản phẩm thuộc danh mục
        const total = await Product.countDocuments({
            category_id: category._id,
            deleted: false,
            status: "active"
        });

        // Trả về phản hồi
        res.status(200).json({
            status: "success",
            message: "Tải dữ liệu thành công",
            data: {
                productList,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success : false,
            message: "Lỗi server",
            error: error.message
        });
    }
     
}

// GET /detailProduct/:slug
module.exports.detailProduct = async (req , res) => {
    try {
        const slug = req.params.slug;
        const product = await Product.findOne({
            slug : slug ,
            deleted : false
        })

        product.priceNew = ((1 - product.discountPercentage/100) * product.price).toFixed(0);

        res.status(200).json({
            success : true,
            data : {
                product
            }
        })

    } catch (error) {
        res.status(500).json({
            success : false,
            message: "Lỗi server",
            error: error.message
        });
    }
}