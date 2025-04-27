const routerHome = require("./home.route") ;
const routerUser = require("./users.route") ;
const routerSearch = require("./search.route") ;
const routerCart = require("./carts.route");
const routeCheckout = require("./checkout.route");
const cartMid = require("../middlewares/carts.middleware")

module.exports = (app) => {
    
    app.use(cartMid.ensureCart)

    app.use("/" , routerHome);
    app.use("/users" , routerUser) ;
    app.use("/search" , routerSearch) ;
    app.use("/carts" , routerCart);
    app.use("/checkout" , routeCheckout);
}