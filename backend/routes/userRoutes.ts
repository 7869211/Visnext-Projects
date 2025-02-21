import express from "express";
import UserController from "../controllers/UserController/userController";
import Authentication from "../middlewares/authentication";
import RoleBaseMiddleware from "../middlewares/roleBaseMiddleware";

const router = express.Router();

router.post(`/sign-up`, UserController.signup);

router.post(`/signin`, UserController.signin);

router.get(`/all-users`,Authentication.authenticate,RoleBaseMiddleware.roleMiddleware(['manager']), UserController.getAllUsers);

export default router;