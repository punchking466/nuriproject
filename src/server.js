var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerFile = require("../swagger/index.json");
const yaml = require('yamljs');

var app = express();

//Router Import
var routers = require('./routes/routers');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../image')));

//setup
app.use(express.json());
app.use(express.urlencoded({
  limit: "100mb",
  extended: false
}));
app.use(cookieParser());

app.use(
  cors({
    origin: "*", //모든 출처 허용
  })
)


//Routers
app.use('/', routers);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

module.exports = app;
