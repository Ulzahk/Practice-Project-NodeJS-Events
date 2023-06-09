import http, { IncomingMessage } from "http";
import { IErrorHandler } from "@common/interfaces";

export function errorHandler({ res, code, errorMessage }: IErrorHandler) {
  if (!errorMessage) {
    res.statusCode = code;
    res.end(`{"error": "${http.STATUS_CODES[code]}"}`);
  }
  res.statusCode = code;
  res.end(`{"error": "${errorMessage}"}`);
}

export function getReqData(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk: string) => {
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

export function getExpirationTimeUnixFormat() {
  const newDate = new Date();
  newDate.setHours(newDate.getHours() + 24);
  return parseInt((newDate.getTime() / 1000).toFixed(0));
}
