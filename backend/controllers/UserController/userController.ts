import { Request,Response } from "express";
import UserManager from "./userManager";
import constants from "../../constants";
const {ErrorCodes} =constants;
class UserController {
    static async signup(req: Request, res: Response): Promise<void> {
        try {
            console.log("body:",req.body);            

            const user = await UserManager.signup(req.body);
            res.status(ErrorCodes.SUCCESS).json({
                success: true,
                data: user,
                message: 'User registered successfully',
            });
        } catch (error) {
            console.error(`signup:: Error:`, error);
            res.status(ErrorCodes.BAD_REQUEST).json({
                success: false,
                message:'from backend ::Error in signup',
            });
        }
    }

    static async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await UserManager.getAllUsers();
            res.status(ErrorCodes.SUCCESS).json({
                success: true,
                data: users,
                message: 'All users fetched successfully',
            });
        } catch (error) {
            console.error(`getAllUsers:: Error:`, error);
            res.status(ErrorCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error fetching all users',
            });
        }
    }

    static async signin(req: Request, res: Response): Promise<void> {
        try {
            const {token,user} = await UserManager.signin(req.body);
            res.status(ErrorCodes.SUCCESS).json({
                success: true,
                token,
                user,
                message: 'User signed in successfully',
            });
        } catch (error) {
            console.error(`signin:: Error:`, error);
            res.status(ErrorCodes.BAD_REQUEST).json({
                success: false,
                message:'backend::Error in signin',
            });
        }
    }
}

export default UserController;