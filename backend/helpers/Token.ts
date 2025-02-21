import jwt from "jsonwebtoken";
import User from "../models/User";
import config from "../config/default.json";

class Token {

    static generateToken(user: User): string {
        
        const loginToken=jwt.sign({
            id: user.id,
            email: user.email,
            userType: user.userType
        },config.secretKey as string,{
            expiresIn:config.timeouts.login

        });
        return loginToken;
    }

    static varifyLoginToken(token:string):string | jwt.JwtPayload | boolean{
        try{
            console.log("token varififed",token);
            const decoded=jwt.verify(token,config.secretKey) as string;
            return decoded || false;
        }
        catch(err){
            console.log("token not verified",err);
            return false;
        }
    }
}
export default Token;