import JWTAuthenticationService from "@authentication/authentication.service";
import { MOCK_INVALID_TOKEN } from "@mocks/main";
import { Role } from "@users/users.model";

describe("JWTAuthenticationService", () => {
  const jwtAuthService = new JWTAuthenticationService();

  describe("jwtIssuer", () => {
    it("should return a JWT token", () => {
      const payload = { userId: "123" };
      const expiresIn = "1h";

      const token = jwtAuthService.jwtIssuer(payload, expiresIn);

      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);
    });
  });

  describe("jwtVerify", () => {
    it("should verify a valid JWT token", () => {
      const payload = { userId: "123" };
      const expiresIn = "1h";
      const token = jwtAuthService.jwtIssuer(payload, expiresIn);

      const decodedToken: any = jwtAuthService.jwtVerify(token);

      expect(decodedToken.userId).toBe(payload.userId);
      expect(decodedToken.exp).toBeDefined();
    });

    it("should throw an error for an invalid JWT token", () => {
      const invalidToken = MOCK_INVALID_TOKEN;

      expect(() => jwtAuthService.jwtVerify(invalidToken)).toThrow(
        "invalid signature"
      );
    });
  });

  describe("verifyToken", () => {
    const mockRoles = [Role.admin, Role.user];

    it("should verify a valid JWT token from the request headers", () => {
      const token = jwtAuthService.jwtIssuer(
        { userId: "123", role: "user" },
        "1h"
      );
      const mockReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const tokenData: any = jwtAuthService.verifyToken(
        mockReq as any,
        mockRoles
      );

      expect(tokenData.userId).toBe("123");
    });

    it("should throw an error for a request without token", () => {
      const mockReq = {
        headers: {},
      };

      expect(() =>
        jwtAuthService.verifyToken(mockReq as any, mockRoles)
      ).toThrow("request without token");
    });

    it("should throw an error for an invalid JWT token from the request headers", () => {
      const invalidToken = MOCK_INVALID_TOKEN;
      const mockReq = {
        headers: {
          authorization: `Bearer ${invalidToken}`,
        },
      };

      expect(() =>
        jwtAuthService.verifyToken(mockReq as any, mockRoles)
      ).toThrow("invalid signature");
    });

    it("should throw an error for an invalid role", () => {
      const token = jwtAuthService.jwtIssuer(
        { userId: "123", role: "user" },
        "1h"
      );
      const mockReq = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      const mockRoles = [Role.admin];

      expect(() =>
        jwtAuthService.verifyToken(mockReq as any, mockRoles)
      ).toThrow("invalid role");
    });
  });
});
