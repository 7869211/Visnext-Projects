import BugHandler from "../../handlers/BugHandler";
import helpers from '../../helpers';
import constants from '../../constants';
import Bug from "../../models/Bug";

const { BugConstants } = constants;
const { Exception } = helpers;

class BugManager {
  static async createBug({
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
      if (!projectId || !title || !status || !type) {
        console.log('From manager: title, status, and type are required for project');
        throw new Exception(BugConstants.MESSAGES.FIELDS_ARE_REQUIRED);
      }
  
      const result = await BugHandler.createBugHandler({
        projectId,
        title,
        description,
        assignedTo,
        type,
        status,
        deadline,
      });
  
      if (!result.success) {
        console.error('Bug creation failed:', result.message);
        throw new Exception(BugConstants.MESSAGES.ERROR_IN_CREATING_BUG, result.status);
      }
  
      console.log('Bug created successfully');
      return result.data; 
    } catch (error) {
      console.error('Error creating bug:', error);
      throw new Exception(BugConstants.MESSAGES.ERROR_IN_CREATING_BUG);
    }
  }
  

  static async getAllBugsById(projectId: number): Promise<Bug[]> {
    if (!projectId) {
      throw new Exception(BugConstants.MESSAGES.FIELDS_ARE_REQUIRED);
    }

    try {
      const bugs = await BugHandler.getBugsByIdHandler(projectId);
      return bugs;
    } catch (error) {
      console.error('Error in BugManager while fetching bugs:', error);
      throw new Exception(BugConstants.MESSAGES.ERROR_IN_GETTING_BUGS_BY_ID);
    }
  }

  static async updateBugStatus(bugId: number, status: string): Promise<number> {
    try {
      if (!bugId || !status) {
        throw new Exception(BugConstants.MESSAGES.BUGID_AND_STATUS_REQUIRED);
      }
  
      const result = await BugHandler.updateBugStatusHandler(bugId, status);
  
      if (!result) {
        throw new Exception(BugConstants.MESSAGES.ERROR_IN_UPDATING_BUG_STATUS);
      }
  
      return result;
    } catch (error) {
      console.error('Error in BugManager while updating bug status:', error);
      throw new Exception(BugConstants.MESSAGES.ERROR_IN_UPDATING_BUG_STATUS);
    }
  }

  static async findBugByIds(assignTo:number,projectId:number):Promise<Bug[]>{
    try {
      if (!assignTo ||!projectId) {
        throw new Exception(BugConstants.MESSAGES.ASSIGNEE_AND_PROJECTID_REQUIRED);
      }
      const bugs = await BugHandler.findBugsByUserIdProjectId(assignTo, projectId);
      return bugs;


     } catch(error){
       console.error('Error in BugManager while finding bugs:', error);
       throw new Exception(BugConstants.MESSAGES.ERROR_IN_FINDING_BUGS);
     } 
    };
  }

export default BugManager;
