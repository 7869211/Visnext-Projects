import bcrypt from 'bcryptjs';
import User from '../../models/User';
import helpers from '../../helpers';
import constants from '../../constants';
import UserUtils from '../../utilities/userUtils';
import UserHandler from '../../handlers/UserHandler';

const { UserConstants } = constants;
const { Token, Exception } = helpers;

type signInResponse = {
  token: string;
  user: User;
};

class UserManager {

  static async signup(data: User): Promise<User> {
    try {
      UserUtils.ValidateSignUpRequest(data);

      const existingUser = await UserHandler.findUserByEmail(data.email);
      if (existingUser) {
        console.log("User already exists");
        throw new Exception(UserConstants.MESSAGES.USER_ALREADY_EXIST);
      }

      console.log("User can be created", data);
      data.password = await UserUtils.HashPassword(data.password);
      console.log("User's password hashed", data);

      const user = await UserHandler.createUser(data);
      console.log("User created", data);

      return user;

    } catch (error) {
      console.error('Error in creating the user:', error);
      throw new Exception(UserConstants.MESSAGES.SOMETHING_WENT_WRONG);  
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const users = await UserHandler.getAllUsers();
      return users;
    } catch (error) {
      console.error('Error in getting all users:', error);
      throw new Exception(UserConstants.MESSAGES.SOMETHING_WENT_WRONG);
    }
  }

  static async signin(data: User): Promise<signInResponse> {
    try {
      UserUtils.ValidateSigninRequest(data);

      const existingUser = await UserHandler.findUserByEmail(data.email);
      if (!existingUser) {
        throw new Exception(UserConstants.MESSAGES.USER_DOES_NOT_EXIST);
      }

      const isPasswordMatch = await bcrypt.compare(data.password, existingUser.password);
      if (!isPasswordMatch) {
        throw new Exception(UserConstants.MESSAGES.PASSWORD_DOES_NOT_MATCH);
      }

      const token = Token.generateToken(existingUser);
      const user = existingUser;
      return { token, user };

    } catch (error) {
      console.error('Error during signin:', error);
      throw new Exception(UserConstants.MESSAGES.SOMETHING_WENT_WRONG);
    }
  }
}

export default UserManager;
