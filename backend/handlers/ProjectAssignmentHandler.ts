import ProjectAssignment from "../models/ProjectAssignment";
import User from "../models/User";
import Project from "../models/Project";

class ProjectAssignmentHandler {

  static async assignUsersToProject(projectId: number, userIds: number[]): Promise<ProjectAssignment[]> {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      throw new Error("User IDs must be a non-empty array.");
    }

    try {
      const assignments = await Promise.all(
        userIds.map(async (userId) => {
          const user = await User.findByPk(userId);
          if (!user) {
            console.log(`User not found. UserID: ${userId}`);
            throw new Error(`User not found. UserID: ${userId}`);
          }
          return ProjectAssignment.create({
            projectId,
            userId,
          });
        })
      );

      return assignments;
    } catch (error) {
      console.error("Error in assigning users to project:", error);
      throw new Error("Error in assigning users to the project.");
    }
  }

  static async getAllAssignmentsHandler(): Promise<ProjectAssignment[]> {
    try {
      return await ProjectAssignment.findAll();
    } catch (error) {
      console.error("Error in fetching all assignments:", error);
      throw new Error("Error occurred while fetching project assignments.");
    }
  }

  static async fetchAssignedProjectsHandler(userId: number): Promise<Project[]> {
    try {
      const assignments = await ProjectAssignment.findAll({
        where: { userId },
        include: [
          {
            model: Project,
            attributes: ['id', 'name', 'description', 'managerId'],
          },
        ],
      });

      const projects = assignments
        .map((assignment) => assignment.project)
        .filter((project): project is Project => project !== undefined);

      return projects;
    } catch (error) {
      console.error(`Error in fetching assigned projects for user ${userId}:`, error);
      throw new Error(`Error occurred while fetching projects assigned to user ${userId}.`);
    }
  }
}

export default ProjectAssignmentHandler;
