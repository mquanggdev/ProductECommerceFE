
const express = require("express");
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');

const database = require("./config/database");
database.connect();
const routesApi = require("./routes/index.route");

const app = express();
const port = process.env.PORT;
// CORS
// Cách 1: Tất cả tên miền được phép truy cập
app.use(cors({
  origin: "*"
}));
// End CORS

// parse application/json
app.use(bodyParser.json());
app.use(express.json()) ;

routesApi(app);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});