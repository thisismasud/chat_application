/**
 * Title: Error  Handling Middleware.
 * Description: Handling error, when requested route is not available. And errorHandler is for common erro handling
 * Author: Masud Parvez
 */

const createError = require("http-errors");

//404 Not Found Handler
function notFoundHandler(req, res, next) {
  //Exp 1: createError takes multiple arguments, here first argument is status and second is a   error string.
  next(createError(404, "Your requested page was no found."));
}

//common error handler
function errorHandler(err, req, res, next) {
  res.locals.error = process.env.NODE_ENV === "production" ? err : err.message;
  res.status(err.status || 500);

  if (res.locals.html) {
    //exp: here in below function fist parameter "error" is a filename, which is located in views folder
    res.render("error", {
      title: "Error page",
    });
  } else {
    res.json(res.locals.error);
  }
}
//Exp 2:  Initially, res.locals is an empty object.

//Exp Note 3:  If you include err as the first parameter, Express recognizes it as an error-handling middleware, and it will be called when an error occurs during the request processing. If you omit the err parameter, Express treats it as a regular middleware for normal request handling.

//exports essestial modules
module.exports = {
  notFoundHandler,
  errorHandler,
};
