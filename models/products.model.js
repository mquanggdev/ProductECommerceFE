const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const productModelSchema = new mongoose.Schema({
    title: String,
    description: String,
    category_id: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    slug:{
         type: String,
         slug: "title",
         unique : true 
        },
    featured:{
        type:String,
        default:"0"
    }
}, {
    timestamps: true // tự động thêm trường createAt và updateAt
})

const Product = mongoose.model("Product" , productModelSchema , "products");
module.exports = Product;