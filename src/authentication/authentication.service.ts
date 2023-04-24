import jwt, { Secret } from "jsonwebtoken";
import { config } from "@config/env-variables";
import { IncomingMessage } from "http";

class JWTAuthenticationService {
  private jwtSecret: Secret;

  constructor() {
    this.jwtSecret = config.jwtSecret!;
  }

  jwtIssuer(payload: string | object, expiresIn: string) {
    return jwt.sign(payload, this.jwtSecret!, { expiresIn });
  }

  jwtVerify(token: string) {
    return jwt.verify(token, this.jwtSecret!);
  }

  verifyToken(req: IncomingMessage) {
    const { authorization } = req.headers;

    if (!authorization) throw "request without token";

    const parseAuthorization = authorization.slice(7, authorization.length);
    const tokenData = this.jwtVerify(parseAuthorization);
    if (tokenData === undefined) throw "invalid token";

    return tokenData;
  }
}

export default JWTAuthenticationService;
