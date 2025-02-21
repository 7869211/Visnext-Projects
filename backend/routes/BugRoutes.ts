import express from 'express';
import BugController from '../controllers/BugController/bugController';
import Authentication from '../middlewares/authentication';
const router = express.Router();

router.post('/create-bug/:projectId',Authentication.authenticate, BugController.createBug);

router.get('/get-bugs-by-project/:projectId',Authentication.authenticate, BugController.getAllBugsById);

router.put('/update-bug-status/:bugId',Authentication.authenticate, BugController.updateBugStatus);

router.post('/get-bugs-by-ids/:projectId',Authentication.authenticate, BugController.findBugsByIds);


export default router;