
const Cart = require('../models/cart.model');

module.exports.ensureCart = async (req, res, next) => {
  let cartId = req.cookies.cartId;

  // Nếu không có cartId, tạo mới
  if (!cartId) {
   const cart = new Cart();
   await cart.save()

    res.cookie('cartId', cart.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 ngày
    });
  } else {
    const cart = await Cart.findOne({ _id: cartId });
    if (!cart) {
      await Cart.create({
        _id: cartId,
        products: [],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });

      res.cookie('cartId', cartId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      });
    }
    res.locals.cartTotal = cart.products.length || 0 ;
  }

  

  next();
};