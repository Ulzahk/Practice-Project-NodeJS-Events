import http, { IncomingMessage, ServerResponse } from "http";
import { errorHandler } from "@common/main";
import { config } from "@config/env-variables";
import UsersController from "@users/users.controller";

const server = http.createServer(async function (req: IncomingMessage, res: ServerResponse) {
  if (/\/api\/users/.test(req.url!)) return await UsersController.requestHandler(req, res);

  return errorHandler({ res, code: 404 });
});

server.listen(config.port);
