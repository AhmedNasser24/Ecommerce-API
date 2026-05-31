const { RateLimiterMemory } = require("rate-limiter-flexible");
const ApiError = require("../utils/ApiError");

const rateLimiter = new RateLimiterMemory({
  points: 15, // عدد الطلبات المسموحة
  duration: 1, // لكل 1 ثانية (بمعنى 10 طلبات في الثانية كحد أقصى)
});

exports.rateLimiterMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.ip) // يستهلك نقطة بناءً على الـ IP الخاص بالمستخدم
    .then(() => {
      next(); // إذا كان مسموحاً، يمر الطلب
    })
    .catch(() => {
      const err = new ApiError("Too Many Requests", 429);
      next(err); // إذا تخطى الحد، يتم رفضه
    });
};
