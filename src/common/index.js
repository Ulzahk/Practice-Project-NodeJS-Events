'use strict';
const http = require('http');

function errorHandler({
  res, code, errorMessage
}) {
  if (!errorMessage) {
    res.statusCode = code;
    res.end(`{"error": "${http.STATUS_CODES[code]}"}`);
  }
  res.statusCode = code;
  res.end(`{"error": "${errorMessage}"}`);
};

function getReqData(req) {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        resolve(body);
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  errorHandler,
  getReqData
};