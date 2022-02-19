exports.catchErrors = (fn) => {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => {
      if (err) {
        res.json({
          error: {
            message: err,
          },
        });
        console.log(JSON.stringify(err));
      } else {
        next(err);
      }
    });
  };
};

/*
    MongoDB Schema Error Handler
*/
exports.mongoseErrors = (err, req, res, next) => {
  if (!err.errors) return next(err);
  const errorKeys = Object.keys(err.errors);
  let message = "";
  errorKeys.forEach((key) => (message += err.errors[key].message + ", "));

  message = message.substr(0, message.length - 2);

  res.status(400).json({
    status: 400,
    message,
  });
};

/*
    Development detailed errors
*/
exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || "";
  const errorDetails = {
    status: err.status,
    message: err.phrase,
    error: {
      message: err.message,
      stack: err.stack,
    },
  };

  res.status(err.status || 500).json(errorDetails);
};

/*
    Production Errors - without information
*/
exports.prodErrors = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: "Internal Server Error",
  });
};

// Route not found error
exports.notFound = (req, res, next) => {
  res.status(404).json({
    status: 404,
    message: "Route not found",
  });
};
