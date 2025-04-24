const routerHome = require("./home.route") ;

module.exports = (app) => {

    app.use("/" , routerHome);
}