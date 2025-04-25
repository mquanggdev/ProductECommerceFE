const User = require("../models/users.model");

module.exports.requireAuth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if(!authorization) {
    res. status(400).json({
      message: "Vui lòng gửi kèm theo token."
    });
    return;
  }

  const token = authorization.split(" ")[1];
  if(!token) {
    res. status(400).json({
      message: "Vui lòng gửi kèm theo token."
    });
    return;
  }

  const user = await User.findOne({
    token: token,
    deleted: false
  });

  if(!user) {
    res. status(403).json({
      message: "Vui lòng gửi kèm theo token."
    });
    return;
  }
  req.user = user;
  req.tokenVerify = token; // nhiệm vụ của fe là lấy token này nhét lên cookie (set time là 1day)

  next();
}