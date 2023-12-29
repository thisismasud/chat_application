//this function decorateHtmlResponse is just sets locals variable during response, and 
function decorateHtmlResponse(page_title) {
  return function (req, res, next) {
    res.locals.html = true;
    res.locals.title = `${page_title} - ${process.env.APP_NAME}`;
    next();
  };
}

module.exports = decorateHtmlResponse;
