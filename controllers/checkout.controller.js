const Cart = require("../models/cart.model");
const Product = require("../models/products.model");
const Order = require("../models/orders.model");

// [GET] /checkout
module.exports.index = async (req, res) => {
  try {
    const cartId = req.cartId;

    const cart = await Cart.findOne({ _id: cartId }).populate({
      path: 'products.productId',
      select: 'title thumbnail slug price discountPercentage stock'
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Giỏ hàng không tồn tại'
      });
    }

    if (cart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng trống'
      });
    }

    const cartDetail = {
      _id: cart._id,
      products: cart.products
        .filter(item => item.productId) // Đảm bảo sản phẩm tồn tại
        .map(item => {
          const productInfo = item.productId;
          const priceNew = productInfo.price * (1 - (productInfo.discountPercentage || 0) / 100);
          return {
            productId: productInfo._id,
            title: productInfo.title,
            thumbnail: productInfo.thumbnail,
            slug: productInfo.slug,
            price: productInfo.price,
            discountPercentage: productInfo.discountPercentage,
            priceNew,
            quantity: item.quantity,
            totalPrice: priceNew * item.quantity,
            stock: productInfo.stock
          };
        }),
      totalPrice: 0
    };

    if (cartDetail.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có sản phẩm khả dụng trong giỏ hàng'
      });
    }

    cartDetail.totalPrice = cartDetail.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    res.status(200).json({
      success: true,
      cartDetail
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
    

    
  }

// [Post] /checkout/order
module.exports.orderPost = async (req , res) => {

  try {
    const userInfo = req.body;
    const cartId = req.cartId;

    // Xác thực userInfo
    if (!userInfo.fullname || !userInfo.phone || !userInfo.address) {
      return res.status(400).json({
        success: false,
        message: 'Thông tin người dùng không đầy đủ'
      });
    }

    const cart = await Cart.findOne({ _id: cartId }).populate({
      path: 'products.productId',
      select: 'price discountPercentage stock'
    });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng trống hoặc không tồn tại'
      });
    }

    const orderData = {
      userInfo: {
        fullname: userInfo.fullname,
        phone: userInfo.phone,
        address: userInfo.address
      },
      products: []
    };

    // Kiểm tra tồn kho và xây dựng orderData
    for (const item of cart.products) {
      const productInfo = item.productId;
      if (!productInfo) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${item.productId} không tồn tại`
        });
      }

      if (productInfo.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${productInfo.title} không đủ tồn kho`
        });
      }

      orderData.products.push({
        productId: item.productId, // Đã là String
        price: productInfo.price,
        discountPercentage: productInfo.discountPercentage,
        quantity: item.quantity
      });
    }

    // Cập nhật tồn kho nguyên tử
    for (const item of cart.products) {
      const updateResult = await Product.findOneAndUpdate(
        { _id: item.productId._id, stock: { $gte: item.quantity } }, // Đảm bảo đủ tồn kho
        { $inc: { stock: -item.quantity } },
        { new: true } // Trả về document sau khi cập nhật
      );

      if (!updateResult) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${item.productId} không đủ tồn kho hoặc không tồn tại`
        });
      }
    }

    // Tạo đơn hàng
    const newOrder = new Order(orderData);
    await newOrder.save();

    // Xóa giỏ hàng
    await Cart.updateOne({ _id: cartId }, { products: [] });

    res.status(200).json({
      success: true,
      message: 'Đặt hàng thành công',
      orderId: newOrder._id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
    
}

//GET /checkout/success/:orderId

module.exports.orderSuccess = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const order = await Order.findOne({ _id: orderId }).populate({
      path: 'products.productId',
      select: 'title thumbnail'
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Đơn hàng không tồn tại'
      });
    }

    const orderDetail = {
      _id: order._id,
      userInfo: order.userInfo,
      products: order.products.map(item => {
        const productInfo = item.productId;
        const priceNew = item.price * (1 - (item.discountPercentage || 0) / 100);
        return {
          productId: item.productId,
          title: productInfo ? productInfo.title : 'Sản phẩm không còn tồn tại',
          thumbnail: productInfo ? productInfo.thumbnail : null,
          price: item.price,
          discountPercentage: item.discountPercentage,
          priceNew,
          quantity: item.quantity,
          totalPrice: priceNew * item.quantity
        };
      }),
      status: order.status,
      paid: order.paid,
      createdAt: order.createdAt,
      totalPrice: 0
    };

    orderDetail.totalPrice = orderDetail.products.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    res.status(200).json({
      success: true,
      data: orderDetail
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
}