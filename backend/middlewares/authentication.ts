import { Request, Response, NextFunction } from "express";
import config from "../config/default.json";
import jwt from "jsonwebtoken";
import helpers from "../helpers";
import constants from "../constants";
import User from "../models/User";
import UserHandler from "../handlers/UserHandler";

const { ErrorCodes, UserConstants } = constants;
const { Validators, Exception } = helpers;

type AuthRequest = Request & { user?: User };

type JwtPayload = {
  id: string;
  email: string;
  userType: string;
};

class Authentication {
  static async authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        console.log("from authentication: Authorization header is missing.");
        throw new Exception(
          UserConstants.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED,
          ErrorCodes.CONFLICT_WITH_CURRENT_STATE,
          { reportError: true }
        );
      }
      const token = Validators.isValidStr(authHeader)
        ? authHeader.split(" ")[1]
        : null;

      if (!token) {
        console.log(`from authentication: Token is missing.`);
        throw new Exception(
          UserConstants.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED,
          ErrorCodes.CONFLICT_WITH_CURRENT_STATE,
          { reportError: true }
        );
      }

      const decoded = jwt.verify(token, config.secretKey as string) as JwtPayload;

      if (!decoded || !decoded.id || !decoded.email || !decoded.userType) {
        console.log(`from authentication: Token is invalid or expired.`);
        throw new Exception(
          UserConstants.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED,
          ErrorCodes.CONFLICT_WITH_CURRENT_STATE,
          { reportError: true }
        );
      }
      const authenticatedUser = await UserHandler.findUserByEmail(decoded.email);
      if (!authenticatedUser) {
        console.log(
          `authenticate:: Token is invalid, no user found. token:: ${token} decoded:: `,
          decoded
        );

        throw new Exception(
          UserConstants.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED,
          ErrorCodes.CONFLICT_WITH_CURRENT_STATE,
          { reportError: true }
        ).toJson();
      }
      req.user = authenticatedUser;

      next();
    } catch (error) {
      console.error("Error in authentication middleware:", error);
      res.status(401).json({ message: UserConstants.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED });
    }
  }
}

export default Authentication;
