const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userInfo : {
        fullname:String,
        phone :String,
        address : String
    },
    products: [
        {
            productId: String,
            price :Number,
            quantity: Number,
            discountPercentage : Number ,
        }
    ],
    status:{
        type : String ,
        default : "intransit"
    },
    paid: {
        type : String , 
        default : "unpaid"
    },

}, {
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;