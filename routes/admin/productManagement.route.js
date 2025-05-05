const express = require("express");
const router = express.Router() ;
const controller = require("../../controllers/admin/productManagement") ;


router.get("/", controller.index );
router.post("/createPr", controller.createPr) ;
router.patch("/updatePr/:id" , controller.updatePr) ;
router.patch("/deletePr/:id" , controller.deletePr) ; 
router.patch("/detail/:id" , controller.detailPr) ;



module.exports = router ;


