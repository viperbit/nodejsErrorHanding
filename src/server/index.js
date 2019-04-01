require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const server = express();
const path = require("path");

const routes = require("./routes");

const moment = require("moment");

const CustomError = require("./CustomError");
const response = require("./utils/response");
const logger = require("./utils/winston");

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.use("/api", routes); // this is our actual API

server.use(express.static(path.join(__dirname, "../../dist"))); // server react app assets
server.use((req, res) =>
  res.sendFile(path.join(__dirname, "../../dist/index.html"))
); // fallback to the react app

// catch 404 and forward to error handler
server.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);

  //   res.status(404).send({
  //     error: 'NOT_FOUND',
  //     description: 'The resource you tried to access does not exist.',
  // })
});

// error handler
server.use((err, req, res, next) => {
  let apiError = err;

  if (!(err instanceof CustomError)) {
    apiError = new CustomError(
      "GENERIC",
      500,
      "Something went wrong. Please try again or contact support."
    );
  }

  if (process.env.NODE_ENV === "test") {
    const errObj = {
      req: {
        headers: req.headers,
        query: req.query,
        body: req.body,
        route: req.route
      },
      error: {
        message: err.message,
        stack: err.stack,
        status: err.status
      },
      user: req.user
    };
    console.log("errObj:", errObj);
    logger.error(`${moment().format("YYYY-MM-DD HH:mm:ss")}`, errObj);
  } else {
    res.locals.message = apiError.message;
    res.locals.error = apiError;
  }
  // render the error page
  return response(
    res,
    {
      error: apiError.code,
      description: apiError.message
    },
    apiError.status
  );
  //res.status(apiError.status).json({ message: apiError.message });
});

server.listen(3000, () => {
  console.log("Server listening on http://localhost:3000");
});
