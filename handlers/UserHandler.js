
const {
  Validators,
  db
} = require('../helpers');

const User = db.User;

class UserHandler {

  static findUserByEmail (email) {
    return User.findOne({ where: { email }})
  }

  static findUserByAccessToken (token) {
    return User.findOne({ where: { access_token: token }})
  }

  static createUser ({ email, name, password }) {
    console.log(name,'sdfasd')
    const user = User.build({ email, username: name, password })

    return user.save();

  }

  static setAccessToken (userId, accessToken, refreshToken) {
    return User.update(
      {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      {
        where: {
          id: userId,
        },
        returning: '*'
      },
    );
  }

  static getAuthenticateUser (userId, email = " ", authToken) {
    return User.findOne({ where: {
      email,
      id: Validators.parseInteger(userId, -1),
      access_token: authToken,
    }})
  }

}

module.exports = UserHandler;
