import { IncomingMessage, ServerResponse } from "http";
import {
  errorHandler,
  getReqData,
  getExpirationTimeUnixFormat,
} from "@common/functions";

describe("errorHandler", () => {
  it("should set the correct status code and error message in the response", () => {
    const res: ServerResponse = {
      statusCode: 0,
      end: jest.fn(),
    } as any;

    errorHandler({ res, code: 404, errorMessage: "Not Found" });

    expect(res.statusCode).toEqual(404);
    expect(res.end).toHaveBeenCalledWith('{"error": "Not Found"}');
  });

  it("should set the correct status code and default error message if no errorMessage is provided", () => {
    const res: ServerResponse = {
      statusCode: 0,
      end: jest.fn(),
    } as any;

    errorHandler({ res, code: 500 });

    expect(res.statusCode).toEqual(500);
    expect(res.end).toHaveBeenCalledWith('{"error": "Internal Server Error"}');
  });
});

describe("getReqData", () => {
  it("returns the request data as a string", async () => {
    const mockReq: IncomingMessage = {
      on: jest.fn().mockImplementation((event: string, callback: any) => {
        if (event === "data") {
          callback("This is");
          callback(" a test");
        }
        if (event === "end") {
          callback();
        }
      }),
    } as any;

    const result = await getReqData(mockReq as any);
    expect(result).toBe("This is a test");
  });

  it("rejects with an error if an exception is thrown", async () => {
    const mockReq = {
      on: jest.fn().mockImplementation(() => {
        throw new Error("Something went wrong");
      }),
    };

    await expect(getReqData(mockReq as any)).rejects.toThrow(
      "Something went wrong"
    );
  });
});

describe("getExpirationTimeUnixFormat", () => {
  it("return expected time in unix format", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2000-01-01"));

    const result = getExpirationTimeUnixFormat();
    expect(result).toEqual(946771200);
  });
});
