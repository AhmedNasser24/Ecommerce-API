
exports.sanatizeUser = function (user) {
  return {
    _id: user._id,
    name: user.name,
    slug: user.slug,
    email: user.email,
    role: user.role,
    phone: user.phone,
    image: user.image,
    addresses: user.addresses,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

