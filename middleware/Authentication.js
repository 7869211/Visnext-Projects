const {
  UserHandler
} = require('../handlers');

const {
  ErrorCodes,
  UserConstants
} = require('../constants');

const {
  Validators,
  Exception,
  jwt,
  config
} = require('../helpers');

class Authentication {

  static async authenticate (req, res, next) {

    try {

      let token = Validators.isValidStr(req.headers.authorization) ? req.headers.authorization.split(' ') : null;

      if (!Array.isArray(token) || token.length < 1) {

        console.log(`authenticate:: Token is invalid. token:: `, token);

        throw new Exception(UserConstants.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED, ErrorCodes.CONFLICT_WITH_CURRENT_STATE, { reportError: true }).toJson();

      }

      console.log(token, "coming here")

      token = token[1];

      console.log(token, "coming here", jwt, config.secretKey)
      const decoded = jwt.verify(token, config.secretKey);


      if (!decoded || !decoded.id || (!decoded.email)) {

        console.log(`authenticate:: Token is invalid or expired. token:: ${token} decoded:: `, decoded);

        throw new Exception(UserConstants.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED, ErrorCodes.CONFLICT_WITH_CURRENT_STATE, { reportError: true }).toJson();

      }

      const user = await UserHandler.getAuthenticateUser(decoded.id, decoded.email, token);
 
      console.log(user)
      if (!user) {

        console.log(`authenticate:: Token is invalid, no user found. token:: ${token} decoded:: `, decoded);

        throw new Exception(UserConstants.MESSAGES.TOKEN_IS_INVALID_OR_EXPIRED, ErrorCodes.CONFLICT_WITH_CURRENT_STATE, { reportError: true }).toJson();

      }

      req.user = user;

      next();

    } catch (error) {
      console.log(error)

      return res.status(ErrorCodes.UNAUTHORIZED).json({
        message: UserConstants.MESSAGES.INVALID_AUTHENTICATION_TOKEN
      });

    }

  }

}

module.exports = Authentication;
