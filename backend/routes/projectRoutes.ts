import express from "express";
import ProjectController from "../controllers/ProjectController/projectController";
import Authentication from "../middlewares/authentication";
import RoleBaseMiddleware from "../middlewares/roleBaseMiddleware";

const router = express.Router();

router.post(`/create-project`,Authentication.authenticate,RoleBaseMiddleware.roleMiddleware(['manager']), ProjectController.createProject);

router.get(`/all-projects`,Authentication.authenticate,RoleBaseMiddleware.roleMiddleware(['manager']), ProjectController.getAll);

router.get(`/get-project-by-name/:name`, Authentication.authenticate,RoleBaseMiddleware.roleMiddleware(['manager']),ProjectController.searchForProject);

router.put(`/update-project/:name`,Authentication.authenticate,RoleBaseMiddleware.roleMiddleware(['manager']), ProjectController.updateProject);

router.delete(`/delete-project/:name`,Authentication.authenticate,RoleBaseMiddleware.roleMiddleware(['manager']), ProjectController.deleteProject);


export default router;