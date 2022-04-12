require("dotenv").config();
const morganBody = require("morgan-body");
const express = require("express");
const cors = require("cors");
const app = express();
const { PORT_TEST, PORT, NODE_ENV, API_VERSION } = process.env;
const port = NODE_ENV == "test" ? PORT_TEST : PORT;

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
morganBody(app);

// SWAGGER generate API doc
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./public/src/swagger.json");

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// CORS allow all
app.use(cors());

// API routes
app.use("/api/" + API_VERSION, [require("./server/routes/user_route")]);
// Page not found
app.use(function (req, res, next) {
  res.sendStatus(404);
});

// Error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).send("Internal Server Error");
});

if (NODE_ENV != "production") {
  app.listen(port, async () => {
    console.log(`Listening on port: ${port}`);
  });
}
