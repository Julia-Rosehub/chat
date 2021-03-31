const httpStatus = require('http-status-codes');

const respondNoResourceFound = (req, res) => {
    let errorCode = httpStatus.NOT_FOUND;
    res.status(errorCode);
    res.render("error")
};

const respondInternalError = (error, req, res, next) => {
    let errorCode = httpStatus.INTERNAL_SERVER_ERROR;
    console.log(`ERROR occurred: ${error.stack}`)
    res.status(errorCode).send(`${errorCode} | Sorry, our application is
  experiencing a problem!`);
};

module.exports = ({ respondInternalError, respondNoResourceFound })



