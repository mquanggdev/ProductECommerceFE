const routerHome = require("./home.route") ;
const routerUser = require("./users.route") ;

module.exports = (app) => {

    app.use("/" , routerHome);
    app.use("/users" , routerUser) ;
}