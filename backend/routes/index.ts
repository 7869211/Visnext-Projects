import userRoutes from './userRoutes';
import projectRoutes from './projectRoutes';
import projectAssignmentRoutes from './projectAssignmentRoutes';
import BugRoutes from './BugRoutes';
import express from 'express';
const USERS_ROUTES_PREFIX = "user";

const PROJECTS_ROUTES_PREFIX = "project";

const BUGS_ROUTES_PREFIX = "bug";


const router=express.Router();

router.use(`/api/v1/${USERS_ROUTES_PREFIX}`,userRoutes)

router.use(`/v1/${PROJECTS_ROUTES_PREFIX}`,projectRoutes)

router.use(`/v1/${PROJECTS_ROUTES_PREFIX}/assignment`,projectAssignmentRoutes)

router.use(`/v1/${BUGS_ROUTES_PREFIX}`,BugRoutes)

export default router;