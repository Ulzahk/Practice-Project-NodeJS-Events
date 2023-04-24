import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { config } from "@config/env-variables";
import { IncomingMessage } from "http";
import { Role } from "@users/users.model";

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

  verifyToken(req: IncomingMessage, roles: Role[]) {
    const { authorization } = req.headers;

    if (!authorization) throw "request without token";

    const parseAuthorization = authorization.slice(7, authorization.length);
    const tokenData = this.jwtVerify(parseAuthorization) as JwtPayload;

    if (!tokenData) throw "invalid token";
    if (!roles.includes(tokenData.role)) throw "invalid role";

    return tokenData;
  }
}

export default JWTAuthenticationService;
