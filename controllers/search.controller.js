const Product = require("../models/products.model");

// [GET]/ -> lưu ý cần chèn thêm url là ?keyword=""&page=1&limit=10..
module.exports.index = async (req , res) => {
    try {

    // Lấy từ khóa tìm kiếm và tham số phân trang
    const keyword = req.query.keyword || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
 
    
    const query = {
        title : {$regex:keyword , $options : "i"}
    }
    const productList = await Product.find(query).skip(skip).limit(limit) ;
    const totalProduct = await Product.countDocuments(query) ;

    res.status(200).json({
        success : true ,
        data : {
            productList ,
            pagination : {
                page , 
                limit,
                totalPages : Math.ceil(totalProduct / limit)
            }
        }
    })
    } catch (error) {
        res.status(500).json({
            success : false ,
            message : "Lỗi server"
        });
    }
}