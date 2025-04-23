
const express = require("express");
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');

const database = require("./config/database");
database.connect();
const routesApi = require("./routes/client/index.route");

const app = express();
const port = process.env.PORT;
// CORS
// Cách 1: Tất cả tên miền được phép truy cập
app.use(cors());

// Cách 2: Áp dụng cho 1 tên miền cụ thể
// const corsOptions = {
//   origin: 'https://abc.com',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }
// app.use(cors(corsOptions));
// End CORS

// parse application/json
app.use(bodyParser.json());

routesApi(app);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});