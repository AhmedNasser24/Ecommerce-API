const categoryRoutes = require("../features/category/routes/categoryRoute");
const subcategoryRoutes = require("../features/subcategory/routes/subcategoryRoute");
const brandRoutes = require("../features/brand/routes/brandRoute");
const productRoutes = require("../features/product/routes/productRoutes");
const userRoutes = require("../features/user/routes/userRoutes");
const profileRoutes = require("../features/user/routes/profileRoutes");
const authRoutes = require("../features/user/routes/authRoutes");
const reviewRoutes = require("../features/review/routes/reviewRoutes");
const addressesRoutes = require("../features/user/routes/addressesRoutes");
const couponRoutes = require("../features/cart/routes/couponsRoutes");
const cartRoutes = require("../features/cart/routes/cartRoutes");
const orderRoutes = require("../features/order/routes/orderRoutes");

const mountRoutes = (app) => {
  app.use("/api/v1/categories", categoryRoutes);
  app.use("/api/v1/subcategories", subcategoryRoutes);
  app.use("/api/v1/brands", brandRoutes);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/reviews", reviewRoutes);
  app.use("/api/v1/addresses", addressesRoutes);
  app.use("/api/v1/profile", profileRoutes);
  app.use("/api/v1/coupons", couponRoutes);
  app.use("/api/v1/cart", cartRoutes);
  app.use("/api/v1/orders", orderRoutes);
};

module.exports = mountRoutes;
