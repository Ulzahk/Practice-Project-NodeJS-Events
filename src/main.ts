import http, { IncomingMessage, ServerResponse } from "http";
import { errorHandler } from "@common/functions";
import { config } from "@config/env-variables";
import {
  URL_API_LISTS_REGEX,
  URL_API_TASKS_REGEX,
  URL_API_USERS_REGEX,
} from "@common/values";
import UsersController from "@users/users.controller";
import ListsController from "@lists/lists.controller";
import TasksController from "@tasks/tasks.controller";

const server = http.createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    if (URL_API_USERS_REGEX.test(req.url!)) {
      const usersController = new UsersController();
      return await usersController.requestHandler(req, res);
    }

    if (URL_API_LISTS_REGEX.test(req.url!)) {
      const listController = new ListsController();
      return await listController.requestHandler(req, res);
    }

    if (URL_API_TASKS_REGEX.test(req.url!)) {
      const tasksController = new TasksController();
      return await tasksController.requestHandler(req, res);
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
    }

    res.statusCode = 404;
    res.end(`{"error": "${http.STATUS_CODES[res.statusCode]}"}`);
  }
);

server.listen(config.port);
