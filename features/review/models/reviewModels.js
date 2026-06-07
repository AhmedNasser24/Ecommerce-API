const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    comment:{
        type:String,
        trim:true,
        minlength:[3,"comment is too short"],
        maxlength:[100,"comment is too long"],
    },
    rating:{
        type:Number,
        required:[true,"Rating is required"],
        min:[1,"Rating must be at least 1"],
        max:[5,"Rating must be at most 5"],
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User is required"],
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:[true,"Product is required"],
    },
},{timestamps:true});

const ReviewModel = mongoose.model("Review",reviewSchema);

module.exports = ReviewModel;