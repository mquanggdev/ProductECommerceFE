const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const CategoryModelSchema = new mongoose.Schema({
    title: String,
    description: String,
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
        },
    createBy:{
        createAt: {
            type:Date ,
            default:Date.now
        }
    },
    deleteBy:{
        deletedAt:Date
    },
    updateBy:
        {
            updateAt:Date
        },
}, {
    timestamps: true // tự động thêm trường createAt và updateAt
})

const Category = mongoose.model("Category" , CategoryModelSchema , "category");
module.exports = Category;