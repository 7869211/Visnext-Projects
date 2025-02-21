import constants from '../constants';
import helpers from '../helpers';
import User from '../models/User';
import { Request, Response, NextFunction } from 'express';

const { ErrorCodes, UserConstants } = constants;
const { Exception } = helpers;

type AuthRequest = Request & { user?: User };

class RoleBaseMiddleware {
  static roleMiddleware = (allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      const user = req.user;

      if (!user || !user.userType) {
        console.log("from rolebaseMiddleware: usetype not found.");
        throw new Exception(
          UserConstants.MESSAGES.USER_TYPE_NOT_FOUND,
          ErrorCodes.BAD_REQUEST,
          { reportError: true }
        );
      }

      const { userType } = user;

      if (!allowedRoles.includes(userType)) {
        throw new Exception(
          UserConstants.MESSAGES.REQUIRED_USERTYPE_NOT_FOUND,
          ErrorCodes.FORBIDDEN,
          { reportError: true }
        );
      }

      next();
    };
  };
}

export default RoleBaseMiddleware;
