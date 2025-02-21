import ProjectHandler from "../../handlers/ProjectHandler";
import Project from "../../models/Project";
import helpers from '../../helpers';
import constants from '../../constants';
import { InferCreationAttributes } from '@sequelize/core';

const { ProjectConstants } = constants;
const { Exception } = helpers;

class ProjectManager {
  static async createProject(projectData: Omit<InferCreationAttributes<Project>, "id">): Promise<Project> {
    try {
      const existingProject = await ProjectHandler.findProjectByName(projectData.name);
      if (existingProject) {
        console.log("Project already exists");
        throw new Exception(ProjectConstants.MESSAGES.PROJECT_ALREADY_EXIST);
      }

      const createdProject = await ProjectHandler.createProjectHandler(projectData);
      console.log("Project created");
      return createdProject;
    } catch (error) {
      console.log("from ProjectManager: Error in project creation", error);
      throw new Exception(ProjectConstants.MESSAGES.FAILED_TO_CREATE_A_PROJECT);
    }
  }

  static async updateProject(name: string, updatedData: Project): Promise<number> {
    try {
      const existingProject = await ProjectHandler.findProjectByName(name);
      if (!existingProject) {
        console.log("project does not exist");
        throw new Exception(ProjectConstants.MESSAGES.PROJECT_DOES_NOT_EXIST);
      }

      const updatedProject = await ProjectHandler.updateProjectHandler(name, updatedData);
      if (updatedProject === 0) {
        console.log("project is not updated");
        throw new Exception(ProjectConstants.MESSAGES.FAILED_TO_UPDATE_A_PROJECT);
      }

      console.log("project updated", updatedData);
      return updatedProject;
    } catch (error) {
      console.error("Error in updating the project:", error);
      throw new Exception(ProjectConstants.MESSAGES.SOMETHING_WENT_WRONG);
    }
  }

  static async deleteProject(name: string): Promise<number> {
    try {
      const existingProject = await ProjectHandler.findProjectByName(name);
      if (!existingProject) {
        console.log("project does not exist!");
        throw new Exception(ProjectConstants.MESSAGES.PROJECT_DOES_NOT_EXIST);
      }

      const deletedProject = await ProjectHandler.deleteProjectHandler(name);
      if (deletedProject === 0) {
        console.log("project is not deleted");
        throw new Exception(ProjectConstants.MESSAGES.FAILED_TO_DELETE_A_PROJECT);
      }

      console.log("project deleted successfully");
      return deletedProject;
    } catch {
      console.log("from manager :: error in deleting the project");
      throw new Exception(ProjectConstants.MESSAGES.FAILED_TO_DELETE_A_PROJECT);
    }
  }

  static async getAllProjects(): Promise<Project[]> {
    try {
      const allProjects = await ProjectHandler.getAllProjectsHandler();
      if (!allProjects) {
        console.log("no projects fetched");
      }
      console.log("all projects fetched successfully!");
      return allProjects;
    } catch {
      console.log("from project manager :: error in fetching all projects");
      throw new Exception(ProjectConstants.MESSAGES.SOMETHING_WENT_WRONG);
    }
  }

  static async searchForProject(name: string): Promise<Project> {
    try {
      const searchedProject = await ProjectHandler.findProjectByName(name);
      if (!searchedProject) {
        console.log("no project found with given name");
        throw new Exception(ProjectConstants.MESSAGES.PROJECT_NOT_FOUND);
      }

      console.log("project searched for the given name");
      return searchedProject;
    } catch {
      console.log("from project manager:: error in searching the project");
      throw new Exception(ProjectConstants.MESSAGES.SOMETHING_WENT_WRONG);
    }
  }
}

export default ProjectManager;
