const { RateLimiterMemory } = require("rate-limiter-flexible");
const ApiError = require("../utils/ApiError");

// 1. المحدد العام لجميع المسارات: 15 طلب في الثانية الواحدة
const defaultRateLimiter = new RateLimiterMemory({
  points: 15,
  duration: 1, 
});

// 2. المحدد الخاص بمسار الفئات: 20 طلب في 3 ثوانٍ
const categoryRateLimiter = new RateLimiterMemory({
  points: 20,
  duration: 3, 
});

exports.rateLimiterMiddleware = (req, res, next) => {
  // فحص ما إذا كان المسار الحالي يبدأ بـ /api/v1/categories أو /categories حسب نظام التسمية عندك
  const isCategoryRoute = req.originalUrl.startsWith("/api/v1/categories") || req.originalUrl.startsWith("/categories");

  // اختيار المحدد المناسب بناءً على الشرط
  const selectedLimiter = isCategoryRoute ? categoryRateLimiter : defaultRateLimiter;

  selectedLimiter
    .consume(req.ip) // استهلاك نقطة من المحدد المختار بناءً على الـ IP
    .then(() => {
      next(); // إذا كان مسموحاً، يمر الطلب
    })
    .catch(() => {
      const err = new ApiError("Too Many Requests", 429);
      next(err); // إذا تخطى الحد، يتم تمرير الخطأ لـ Global Error Handler
    });
};