import express from 'express';
import ProjectAssignmentController from '../controllers/ProjectAssignmentController/projectAssignmentController';
import Authentication from '../middlewares/authentication';
const router = express.Router();

router.post('/:projectId', ProjectAssignmentController.assignUsersToProject);

router.get('/get-all-assignments',ProjectAssignmentController.getAllAssignments );

router.get('/:userId',Authentication.authenticate, ProjectAssignmentController.getAssignedProjectsForUser);
export default router;