const routerProduct = require("./productManagement.route") ;

module.exports = (app) => {
    app.use("/admin/products" , routerProduct) ;
}