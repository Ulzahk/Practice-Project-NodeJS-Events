import http, { IncomingMessage, ServerResponse } from "http";
import { errorHandler } from "@common/main";
import { config } from "@config/env-variables";
import UsersController from "@users/users.controller";

const server = http.createServer(async function (
  req: IncomingMessage,
  res: ServerResponse
) {
  if (/\/api\/users/.test(req.url!)) {
    const usersController = new UsersController();
    return await usersController.requestHandler(req, res);
  }

  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "text/html;charset=utf-8",
    });

    const initialHtmlPage = `
      <html>
        <head>
          <style>
            body { background: #333; margin: 1.25rem }
            p { color: #FFF; font-size: 2rem; font-family: sans-serif }
          </style>
        </head>
        <body>
          <div style="text-align: center;">
            <p>
              API Status: [🟢 Online]
            </p>
          </div>
        </body>
      </html>
    `;

    return res.end(initialHtmlPage);
  } else {
    return errorHandler({ res, code: 404 });
  }
});

server.listen(config.port);
