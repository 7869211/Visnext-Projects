import { Bug } from '../models/Bug';
import { ProjectAssignment } from '../models/ProjectAssignment';
import { User } from '../models/User';
import { Project } from '../models/Project';
import constants from '../constants';

const { ErrorCodes } = constants;

class BugHandler {
  static async createBugHandler({
    projectId,
    title,
    description,
    assignedTo,
    type,
    status,
    deadline,
  }: {
    projectId: number;
    title: string;
    description: string | null;
    assignedTo: number;
    type: 'bug' | 'feature';
    status: 'new' | 'started' | 'completed' | 'resolved';
    deadline: string | null;
  }) {
    try {
      const project = await Project.findByPk(projectId);
      if (!project) {
        return { success: false, status: ErrorCodes.DOCUMENT_NOT_FOUND, message: 'Project not found' };
      }
  
      const developer = await User.findOne({
        where: { id: assignedTo, userType: 'developer' },
      });
      if (!developer) {
        return { success: false, status: ErrorCodes.DOCUMENT_NOT_FOUND, message: 'Assignee is not a Developer' };
      }
  
      const assignment = await ProjectAssignment.findOne({
        where: { projectId, userId: assignedTo },
      });
      if (!assignment) {
        return { success: false, status: ErrorCodes.BAD_REQUEST, message: 'Developer is not assigned to this project' };
      }
  
      const newBug = await Bug.create({
        title,
        description,
        projectId,
        assignedTo,
        type,
        status,
        deadline: deadline ? new Date(deadline) : null,
      });
  
      console.log('Bug created:', newBug);
      return { success: true, status: ErrorCodes.SUCCESS, data: newBug };
    } catch (error) {
      console.error('Error in BugHandler:', error);
      return { success: false, status: ErrorCodes.INTERNAL_SERVER_ERROR, message: 'Server error' };
    }
  }
  

  static async getBugsByIdHandler(projectId: number): Promise<Bug[]> {
    try {
      return await Bug.findAll({ where: { projectId } });
    } catch (error) {
      console.error('Error in BugHandler while fetching bugs:', error);
      throw new Error('Error occurred while fetching bugs.');
    }
  }

  static async updateBugStatusHandler(bugId: number, status: string): Promise<number> {
    try {
      const bug = await Bug.findByPk(bugId);
      if (!bug) {
        console.log('from handler::Bug not found');
        return 0;
      }
  
      if (['new', 'started', 'completed', 'resolved'].includes(status)) {
        bug.status = status as 'new' | 'started' | 'completed' | 'resolved';  
      } else {
        console.log('Invalid status');
        return 0;
      }
  
      await bug.save();
      return 1;
    } catch (error) {
      console.error('Error updating bug status:', error);
      return 0;
    }
  }

  static async findBugsByUserIdProjectId(assignedTo: number, projectId: number): Promise<Bug[]>{
    try {
      return await Bug.findAll({
        where: { assignedTo, projectId },
      });
    } catch (error) {
      console.error('Error in BugHandler while fetching bugs:', error);
      throw new Error('Error occurred while fetching bugs.');
    }
  }
  
};

export default BugHandler;
