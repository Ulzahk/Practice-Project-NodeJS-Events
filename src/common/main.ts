import http, { IncomingMessage, ServerResponse } from "http";

export function errorHandler({
  res, code, errorMessage
}: {
  res: ServerResponse,
  code: number,
  errorMessage?: string
}) {
  if (!errorMessage) {
    res.statusCode = code;
    res.end(`{"error": "${http.STATUS_CODES[code]}"}`);
  }
  res.statusCode = code;
  res.end(`{"error": "${errorMessage}"}`);
};

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