const express = require("express");
const router = express.Router() ;
const controller = require("../controllers/home.controller") ;


router.get("/", controller.index ); 
router.get("/category/:slugCategory" , controller.category)
router.get("/detailProduct/:slug" , controller.detailProduct)


module.exports = router ;


