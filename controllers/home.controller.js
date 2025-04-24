
const Product = require("../models/products.model") ;

// GET /home
module.exports.home = async (req , res) => {
    const productsFeatured = await Product// Sản phẩm nổi bật
        .find({
            featured: "1" ,
            deleted : false
        })
        .sort({position : "desc"})
        
    const products = [] ; // tất cả sản phẩm
    const find = {
        deleted : false
    }
    res.json({
        code : 200 ,
        message : "succesful",
        products : products , 
        productsFeatured : productsFeatured 
    })
}