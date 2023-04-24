import jwt, { Secret } from "jsonwebtoken";
import { config } from "@config/env-variables";

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
}

export default JWTAuthenticationService;
