const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const CategoryModelSchema = new mongoose.Schema({
    title: String,
    status: String,
    position: Number,
    deleted: {
        type: Boolean,
        default: false
    },
    slug:{
         type: String,
         slug: "title",
         unique : true 
        }
}, {
    timestamps: true // tự động thêm trường createAt và updateAt
})

const Category = mongoose.model("Category" , CategoryModelSchema , "category");
module.exports = Category;