const Cart = require("../models/cart.model");
const Product = require("../models/products.model");

// [GET] /carts
module.exports.index = async (req, res) => {

    try {
        const cartId = req.cookies.cartId;
  
        const cart = await Cart.findOne({
        _id: cartId
        });
    
        cart.totalPrice = 0;
    
        if(cart.products.length > 0) {
        for (const product of cart.products) {
            const productInfo = await Product.findOne({
            _id: product.productId
            }).select("title thumbnail slug price discountPercentage");
            productInfo.priceNew = (1 - productInfo.discountPercentage/100) * productInfo.price;
            product.productInfo = productInfo;
            product.totalPrice = productInfo.priceNew * product.quantity;
            cart.totalPrice += product.totalPrice;
        }
        }
    

        res.status(200).json({
            success : true ,
            cartDetail : cart
        })
        
    } catch (error) {
        res.status(500).json({
            success : false ,
            message : "Lỗi server"
        })
    }
  }

  // [POST] /carts/add/:productId
module.exports.addPost = async (req,res) => {
    try {
        const cartId = req.cookies.cartId ;    
        const productId = req.params.productId ;
        const quantity = parseInt(req.body.quantity);

        const cart = await Cart.findOne({
            _id : cartId
        })
        const product = await Product.findOne({
            _id : productId 
        })
        let stockProduct = product.stock ;

        const existProductInCart = cart.products.find(item => {
            return item.productId.toString() == productId
        })

        // Kiểm tra tồn kho -> khi người dùng nhập số lượng quá số lượng tồn kho
        if (stockProduct < quantity) {
            return res.status(400).json({ message: 'Sản phẩm không đủ tồn kho' });
        }

        if(existProductInCart) {
            const newQuantity = existProductInCart.quantity + quantity;
            if (stockProduct < newQuantity) {
                return res.status(400).json({ message: 'Sản phẩm không đủ tồn kho' });
              }
            await Cart.updateOne({
                _id : cartId ,
                'products.productId' :productId
            } , {
                $set : {
                    'products.$.quantity':newQuantity,
                     updatedAt: new Date() 
                }
            })
        }else {
            await Cart.updateOne({
                _id : cartId,
            },{
                $push : {
                    products:{
                        productId:productId,
                        quantity : quantity
                    }
                },
                $set: { updatedAt: new Date() }
            })
        }


        res.status(200).json({ message: 'Thêm sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server ' + error.message});
    }
}

// GET /carts/delete/:productId 
module.exports.delete = async (req , res) => {
    try {
        const cartId = req.cookies.cartId;
        const productId = req.params.productId;
    
        const cart = await Cart.findOne({ _id: cartId });
        if (!cart) {
          return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
        }

        const product = await Product.findOne({
            _id : productId 
        })
        let stockProduct = product.stock ;
    
        await Cart.updateOne(
          { _id: cartId },
          {
            $pull: {
              products: { productId }
            },
            $set: { updatedAt: new Date() }
          }
        );

    
    
        res.status(200).json({ message: 'Xóa sản phẩm thành công' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
      }
}

// Get /cart/update/:productId/:quantity 
module.exports.update = async (req , res) => {
    try {
        const cartId = req.cookies.cartId;
        const productId = req.params.productId;
        const quantity = req.params.quantity;
    
        // Kiểm tra số lượng
        if (!quantity || quantity < 1) {
          return res.status(400).json({ message: 'Số lượng phải lớn hơn 0' });
        }
    
        // Kiểm tra sản phẩm
        const product = await Product.findOne({
          _id: productId
        });
        if (!product) {
          return res.status(404).json({ message: 'Sản phẩm không tồn tại hoặc không khả dụng' });
        }
    
        // Kiểm tra tồn kho
        if (product.stock < quantity) {
          return res.status(400).json({ message: 'Sản phẩm không đủ tồn kho' });
        }
    
        const cart = await Cart.findOne({ _id: cartId });
        if (!cart) {
          return res.status(404).json({ message: 'Giỏ hàng không tồn tại' });
        }
    
        await Cart.updateOne(
          { _id: cartId, 'products.productId': productId },
          {
            $set: {
              'products.$.quantity': quantity,
              updatedAt: new Date()
            }
          }
        );
    
        res.status(200).json({ message: 'Cập nhật số lượng thành công' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
      }
}