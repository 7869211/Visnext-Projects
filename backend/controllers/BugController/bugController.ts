import { Request, Response } from 'express';
import BugManager from './bugManager';
import constants from '../../constants';

const { ErrorCodes } = constants;

class BugController {
  static async createBug(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const { title, description, assignedTo, type, status, deadline } = req.body;

      const bug = await BugManager.createBug({
        projectId: Number(projectId),
        title,
        description,
        assignedTo,
        type,
        status,
        deadline,
      });

      res
        .status(ErrorCodes.SUCCESS)
        .json({ success: true, message: 'Bug created successfully', bug });
    } catch (error: any) {
      console.error('Error in BugController:', error);

      const statusCode = error.status || ErrorCodes.INTERNAL_SERVER_ERROR;

      res.status(statusCode).json({
        success: false,
        message: error.message || 'Server error',
      });
    }
  }

  static async getAllBugsById(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      if (!projectId) {
        res.status(ErrorCodes.BAD_REQUEST).json({
          success: false,
          message: 'Project ID is required.',
        });
      }

      const bugs = await BugManager.getAllBugsById(Number(projectId));

      res.status(ErrorCodes.SUCCESS).json({
        success: true,
        message: 'Bugs fetched successfully',
        data: bugs,
      });
    } catch (error) {
      console.error('Error in getAllBugsById:', error);
      res.status(ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to fetch bugs. Please try again later.',
      });
    }
  }

  static async updateBugStatus(req: Request, res: Response): Promise<void> {
    try {
      const { bugId } = req.params;
      const { status } = req.body;
      
     const result= await BugManager.updateBugStatus(Number(bugId), status);
      
      res.status(ErrorCodes.SUCCESS).json({
        success: true,
        data: result,
        message: 'Bug status updated successfully',
      });
    }
    catch(error){
      console.error('Error in updateBugStatus:', error);
      res.status(ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to update bug status. Please try again later.',
      });
    }
  }

  static async findBugsByIds(req: Request, res: Response): Promise<void>{
    try{
      const { userId } = req.body;
      const {projectId}=req.params;
      if(!userId || !projectId){
        res.status(ErrorCodes.BAD_REQUEST).json({
          success: false,
          message: 'userId and ProjectId are required.',
        });
      }
      
      const bugs = await BugManager.findBugByIds(Number(userId), Number(projectId));
      
      res.status(ErrorCodes.SUCCESS).json({
        success: true,
        message: 'Bugs fetched successfully',
        data: bugs,
      });
    }
    catch(error){
      console.error('Error in findBugsByIds:', error);
      res.status(ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to fetch bugs. Please try again later.',
      });
    }
  }
}     

export default BugController;
