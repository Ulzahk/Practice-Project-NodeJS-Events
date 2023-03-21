'use strict';
const http = require('http');

function errorHandler(res, code) {
  res.statusCode = code;
  res.end(`{"error": "${http.STATUS_CODES[code]}"}`);
}

module.exports = {
  errorHandler
};