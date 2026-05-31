const hpp = require("hpp");

exports.hppMiddlewareSecurity = hpp({
  whitelist: ['price'],  // this can repeat
});