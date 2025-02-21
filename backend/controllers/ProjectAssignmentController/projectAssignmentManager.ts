import Project from "../../models/Project";
import ProjectAssignmentHandler from "../../handlers/ProjectAssignmentHandler";
import helpers from '../../helpers';
import constants from '../../constants';

const { ProjectConstants } = constants;
const { Exception } = helpers;
import ProjectAssignment from "../../models/ProjectAssignment";

class ProjectAssignmentManager {
  static async assignUsersToProject(projectId: number, userIds: number[]): Promise<void> {
    if (!projectId || !Array.isArray(userIds) || userIds.length === 0) {
      console.log("from manager::project and user id required");
      throw new Exception(ProjectConstants.MESSAGES.USER_OR_PROJECT_IDS_ARE_INVALID);
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      console.log("from manager::project not found");
      throw new Exception(ProjectConstants.MESSAGES.PROJECT_NOT_FOUND);
    }

    await ProjectAssignmentHandler.assignUsersToProject(projectId, userIds);
  }

  static async getAllAssignments(): Promise<ProjectAssignment[]> {
    try {
      return await ProjectAssignmentHandler.getAllAssignmentsHandler();
    } catch (error) {
      console.error("Manager: Failed to fetch project assignments", error);
      throw new Exception(ProjectConstants.MESSAGES.FAILED_TO_ASSIGN_PROJECT);
    }
  }

  static async getAssignedProjectsForUser(userId: number): Promise<Project[]> {
    if (!userId) {
      throw new Error("from manager::userid is required.");
    }

    try {
      const projects = await ProjectAssignmentHandler.fetchAssignedProjectsHandler(userId);
      if (!Array.isArray(projects)) {
        throw new Exception(ProjectConstants.MESSAGES.NO_PROJECT_ASSIGNED);
      }
      return projects;
    } catch (error) {
      console.error("Manager: Failed to fetch assigned projects", error);
      throw new Exception(ProjectConstants.MESSAGES.FAILED_TO_GET_ASSIGNED_PROJECTS);
    }
  }
}

export default ProjectAssignmentManager;
