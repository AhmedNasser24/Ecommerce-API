const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 32,
    },
    slug: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now(),
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      trim: true,
      minlength: 8,
    },
    image: {
      type: String,
      trim: true,
    },
    addresses: [
      {
        id: mongoose.Schema.Types.ObjectId,
        alias: {
          type: String,
          trim: true,
        },
        address: {
          type: String,
          trim: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetCodeVerified: Boolean,
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  this.password = await bcrypt.hash(this.password, 10);
  next;
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
