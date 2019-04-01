const express = require("express");
const router = express.Router();
const CustomError = require("../CustomError");
const response = require("../utils/response");

router.get("/city", (req, res) => {
  // example for success (this is just to give you an example for async operations)
  return response(res, { name: "Rio de Janeiro" }, 200);
});

router.post("/city", (req, res, next) => {
  // example for unhandled error
  next(
    new Error(
      "Some unexpected error, may also be thrown by a library or the runtime."
    )
  );
});

router.delete("/city", (req, res, next) => {
  // example for handled error
  next(
    new CustomError(
      "CITY_NOT_FOUND",
      404,
      "The city you are trying to delete could not be found."
    )
  );
});

router.patch("/city", (req, res, next) => {
  // example for catching errors and using a CustomError
  try {
    // something bad happens here
    throw new Error("Some internal error");
  } catch (err) {
    console.error(err); // decide what you want to do here

    next(
      new CustomError(
        "CITY_NOT_EDITABLE",
        400,
        "The city you are trying to edit is not editable."
      )
    );
  }
});

module.exports = router;
