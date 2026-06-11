const mongoose = require("mongoose");
const ProductModel = require("../../product/models/productModels");
const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      minlength: [3, "comment is too short"],
      maxlength: [100, "comment is too long"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must be at most 5"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
    },
  },
  { timestamps: true },
);

reviewSchema.statics.calcAverageRatingAndQuantity = async function (productId) {
  // @ts-ignore
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  
  // @ts-ignore
  if (result.length >= 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      avgRating: result[0]?.avgRating || 0,
      ratingsQuantity: result[0]?.ratingsQuantity || 0,
    });
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      avgRating: 0,
      ratingsQuantity: 0,
    });
  }
};
// to calculate average rating and quantity
reviewSchema.post("save", async function () {
  // @ts-ignore
  await this.constructor.calcAverageRatingAndQuantity(this.product);
});


// the doc that is updated will be passed to the post middleware ( in case of findOneAndUpdate)
reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    // @ts-ignore
    await doc.constructor.calcAverageRatingAndQuantity(doc.product);
  }
});

const ReviewModel = mongoose.model("Review", reviewSchema);

module.exports = ReviewModel;
