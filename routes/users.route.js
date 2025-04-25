const express = require("express");
const router = express.Router() ;
const controller = require("../controllers/users.controller") ;
const validate = require("../middlewares/validate.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register",validate.validateRegister,controller.register );
router.post("/login",validate.validateLogin,controller.login );
router.post("/password/forgot", controller.forgotPassword);
router.post("/password/otp", controller.otpPassword);
router.patch("/password/reset", controller.resetPassword);
router.get("/profile", authMiddleware.requireAuth ,controller.profile);


module.exports = router ;


