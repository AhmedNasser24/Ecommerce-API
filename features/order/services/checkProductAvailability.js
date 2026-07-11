const ProductModel = require("../../product/models/productModels");
const { calcCartPriceAndQuantity } = require("../../cart/services/cartServices");

exports.checkProductAvailability = async(cart) =>{
  const productIds = cart.cartItems.map((item) => item.product);
  const products = await ProductModel.find({ _id: { $in: productIds } });
  
  let cartChanged = false;
  const validCartItems = [];

  for (const item of cart.cartItems) {
    const product = products.find((p) => p._id.toString() === item.product.toString());

    if (!product || !product.isActive) {
      cartChanged = true;
      continue;
    }

    let itemChanged = false;

    if (item.price !== product.price) {
      item.price = product.price;
      itemChanged = true;
    }

    if (item.priceAfterDiscount !== product.priceAfterDiscount) {
      item.priceAfterDiscount = product.priceAfterDiscount;
      itemChanged = true;
    }

    if (product.stock === 0) {
      cartChanged = true;
      continue;
    } else if (item.quantity > product.stock) {
      item.quantity = product.stock;
      itemChanged = true;
    }

    if (itemChanged) {
      cartChanged = true;
    }
    validCartItems.push(item);
  }

  if (cartChanged) {
    cart.cartItems = validCartItems;
    calcCartPriceAndQuantity(cart);
    await cart.save();
    return cartChanged ;
    
  }
}