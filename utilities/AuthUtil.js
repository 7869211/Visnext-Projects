const {
  ErrorCodes,
  UserConstants,
} = require('../constants');

const {
  Validators,
  Exception,
  bcrypt
} = require('../helpers');

class AuthUtil {

  static validateUser (user) {

    if (!user) {

      console.log(`validateUser:: User does not exist. user:: `, user);

      throw new Exception(UserConstants.MESSAGES.USER_DOES_NOT_EXIST, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();

    }

  }

  static async createHashedPassword (password) {

    password = await bcrypt.hash(password, 10);

    return password;

  }

  static validateUserForSignUp (user) {

    if (user) {

      console.log(`validateUserForSignUp:: User already exist against this email. user:: `, user);

      throw new Exception(UserConstants.MESSAGES.USER_ALREADY_EXIST, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

  }

  static validateUserToAuthenticate (user) {

    if (!user) {

      console.log(`validateUserToAuthenticate:: User does not exist. user:: `, user);

      throw new Exception(UserConstants.MESSAGES.USER_DOES_NOT_EXIST, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

  }

  static validateRefreshToken (user, decoded) {

    if (!decoded || (!decoded.email)) {

      console.log(`validateRefreshToken:: Refresh token has expired. userId:: ${user.id}, user:: ${user.email} decoded:: `, decoded);

      throw new Exception(UserConstants.MESSAGES.REFRESH_TOKEN_HAS_EXPIRED, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

    if ((user.email !== decoded.email)) {

      console.log(`validateRefreshToken:: Invalid refresh token. userId:: ${user.id}, user:: ${user.email} decoded:: `, decoded);

      throw new Exception(UserConstants.MESSAGES.INVALID_REFRESH_TOKEN, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();

    }

  }

  static validateUserToForgetPassword (user) {

    if (!user) {

      console.log(`validateUserToForgetPassword:: User does not exist. user:: `, user);

      throw new Exception(UserConstants.MESSAGES.USER_DOES_NOT_EXIST, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

  }

  static validateSignUpRequest (data) {

    if (!data || (!data.email)) {

      console.log(`validateSignUpRequest:: Invalid data to sign up user. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_DATA_TO_SIGNUP_USER, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

    if (data.email && !Validators.isValidateEmail(data.email)) {

      console.log(`validateSignUpRequest:: Email is not valid. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_EMAIL, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

    if (!Validators.isValidStr(data.password)) {

      console.log(`validateSignUpRequest:: Password is not valid. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_PASSWORD, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

  }

  static validateRefreshTokenRequest (data) {

    if (!data) {

      console.log(`validateRefreshTokenRequest:: Invalid data to refresh token. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_DATA_TO_REFRESH_TOKEN, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

    if (!Validators.isValidStr(data.refresh_token)) {

      console.log(`validateRefreshTokenRequest:: Refresh token is not valid. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_REFRESH_TOKEN, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

  }

  static validateForgetPasswordRequest (data) {

    if (!data) {

      console.log(`validateForgetPasswordRequest:: Invalid data to validate forget password. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_DATA_TO_VALIDATE_FORGET_PASSWORD, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

    if (!Validators.isValidateEmail(data.email)) {

      console.log(`validateForgetPasswordRequest:: Email is not valid. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_EMAIL, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

  }

  static validateCheckEmailAvailabilityRequest (data) {

    if (!data) {

      console.log(`validateCheckEmailAvailabilityRequest:: Invalid data to check email. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_DATA_TO_CHECK_EMAIL_AVAILABILITY, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

    if (!Validators.isValidateEmail(data.email)) {

      console.log(`validateCheckEmailAvailabilityRequest:: Email is not valid. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_EMAIL, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

  }

  static validateLoginRequest (data) {

    if (!data || (!data.email)) {

      console.log(`validateLoginRequest:: Invalid data to login user. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_DATA_TO_LOGIN, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();

    }

    if (data.email && !Validators.isValidateEmail(data.email)) {

      console.log(`validateLoginRequest:: Invalid email to login user. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_EMAIL, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();

    }

    if (!Validators.isValidStr(data.password)) {

      console.log(`validateLoginRequest:: Invalid password to login user. data:: `, data);

      throw new Exception(UserConstants.MESSAGES.INVALID_PASSWORD, ErrorCodes.UNAUTHORIZED, { reportError: true }).toJson();

    }

  }


  static validateResetPasswordTokenVerificationRequest (user, decoded, resetPasswordToken) {

    if (!resetPasswordToken) {

      console.log(`validateResetPasswordTokenVerificationRequest:: Invalid reset password token provided. resetPasswordToken:: `, resetPasswordToken);

      throw new Exception('Invalid reset password token provided', ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

    if (!user) {

      console.log(`validateResetPasswordTokenVerificationRequest:: User not found with this email or expiry token. users:: ${JSON.stringify(user)} resetPasswordToken:: ${resetPasswordToken} decoded:: `, decoded);

      throw new Exception(UserConstants.MESSAGES.USER_DOES_NOT_EXIST, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

    if (!decoded || !Validators.isNumber(decoded.id) || !decoded.email) {

      console.log(`validateResetPasswordTokenVerificationRequest:: The token has expired. decoded:: `, decoded);

      throw new Exception(UserConstants.MESSAGES.TOKEN_HAS_EXPIRED, ErrorCodes.BAD_REQUEST, { reportError: true }).toJson();

    }

  }

  static formatResponse (users) {

    const data = {};

    data.user = user;

    return data;

  }

}

module.exports = AuthUtil;
