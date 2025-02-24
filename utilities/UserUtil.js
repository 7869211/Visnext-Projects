const {
  ErrorCodes,
  UserConstants
} = require('../constants');

const {
  Exception,
  Validators
} = require('../helpers');

class UserUtil {

  static transformUsersData (users) {

    if (!Array.isArray(users) || !users.length) {

      return users;

    }

    return users.map(user => UserUtil.transformUserData(user));

  }

  static transformUserData (user) {

    if (!user) {

      return user;

    }

    delete user.refresh_token;
    delete user.password;

    return user;

  }

  static updateUserData (user) {

    if (!user) {

      return user;

    }

    delete user.password;

    return user;

  }



  static createReturnData (user) {

    const data = {};

    data.user = user;

    return data;

  }

}

module.exports = UserUtil;
