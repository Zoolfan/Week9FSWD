const express = require("express");
const app = express();
const router = require("./routes/routes.js");
const pool = require("./config.js");
const errorHandler = require("./middlewares/errorhandler.js");
const swaggerUi = require("swagger-ui-express");
const moviesJson = require("./SWAGGER.json");
const morgan = require("morgan");

// untuk tambah data,id tabel saya sudah auto increment

app.use(morgan("tiny"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(moviesJson));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandler);

pool.connect((err, res) => {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  }
});
app.listen(3000);
