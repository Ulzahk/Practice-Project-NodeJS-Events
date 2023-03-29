import http, { IncomingMessage, ServerResponse } from "http";
import { errorHandler } from "@common/main";
import UsersController from "@users/users.controller";
import * as dotenv from 'dotenv'

dotenv.config()
const PORT = process.env.PORT || 3000;

const server = http.createServer(async function (req: IncomingMessage, res: ServerResponse) {
  if (/\/api\/users/.test(req.url!)) {
    return await UsersController.requestHandler(req, res);
  }

  return errorHandler({ res, code: 404 });
});

server.listen(PORT);
