import constants from "../constants";
import helpers from "../helpers";
const { ErrorCodes,ErrorMessages,UserConstants}=constants;
const {Validators,Exception}=helpers;
import bcrypt from 'bcryptjs';
import User from "../models/User";

class UserUtils{
    static ValidateUser(user: User): boolean {
        if (!user) {
            console.log("ValidateUser::User doesn't exist",user);
            throw new Exception(
                UserConstants.MESSAGES.USER_DOES_NOT_EXIST,
                ErrorCodes.UNAUTHORIZED,{reportError: true}
            ).toJson();
        }
        
        return true; 
    }
    
    static async HashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    static ValidateUserForSignUp(user: User): boolean {
        if(user){
            console.log(" ValidateUserForSignUp::user already exist with same email",user);
            throw new Exception(
                UserConstants.MESSAGES.USER_ALREADY_EXIST,
                ErrorCodes.BAD_REQUEST,{reportError: true}
            ).toJson();
        }
        return true; 
    }

    static ValidateUserToAuthenticate(user: User): boolean {
        if(!user){
            console.log(" ValidateUserToAuthenticate:: user doesn't exist to authenticate",user);
            throw new Exception(
                UserConstants.MESSAGES.USER_DOES_NOT_EXIST,
                ErrorCodes.BAD_REQUEST,{reportError: true}
            ).toJson();
        }
        return true;
    }


    static ValidateSignUpRequest(user:User):boolean{
        if(!user || !user.email || !user.userType){
            console.log("validatesignuprequest:: invalid user to signup",user);
            throw new Exception(
                UserConstants.MESSAGES.INVALID_DATA_TO_SIGNUP_USER,
                ErrorCodes.BAD_REQUEST,{reportError: true}
            ).toJson();
        }
        if(!Validators.isValidEmail(user.email)){
            console.log("validatesignuprequest::invalid email to signup",user);
            throw new Exception(
                UserConstants.MESSAGES.INVALID_EMAIL,
                ErrorCodes.BAD_REQUEST,{reportError: true}
            ).toJson();
        }
        if(!Validators.isValidPassword(user.password)){
            console.log("validatesignuprequest:: invalid password to signup",user);
            throw new Exception(
                UserConstants.MESSAGES.INVALID_PASSWORD,
                ErrorCodes.BAD_REQUEST,{reportError: true}
            ).toJson();
        }
        return true;
    }
    static ValidateSigninRequest(user: User): boolean {
        if(!user||!user.email){
            console.log("Validateloginrequest: invalid user credentials to login",user);
            throw new Exception(
                UserConstants.MESSAGES.INVALID_DATA_TO_LOGIN,
                ErrorCodes.UNAUTHORIZED,{reportError: true}
            ).toJson();
        }
        if(user.email && !Validators.isValidEmail(user.email)){
            console.log("validatloginrequest:: Invalid email to login",user);
            throw new Exception(
                UserConstants.MESSAGES.INVALID_EMAIL,
                ErrorCodes.UNAUTHORIZED,{reportError: true}
            ).toJson();
        }
        if(!Validators.isValidStr(user.password)){
            console.log("validatesihgninrequest:: invalid password to login");
            throw new Exception(
                UserConstants.MESSAGES.INVALID_PASSWORD,
                ErrorCodes.UNAUTHORIZED,{reportError: true}
            ).toJson();
        }
        return true;

    }
    
}
export default UserUtils;