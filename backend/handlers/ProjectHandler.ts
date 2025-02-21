import Project from "../models/Project";
import { InferCreationAttributes } from '@sequelize/core';

class ProjectHandler {
  static async createProjectHandler(projectData: Omit<InferCreationAttributes<Project>, "id">): Promise<Project> {
    if (!projectData.name || !projectData.managerId) {
      throw new Error("Project name and managerId are required.");
    }

    try {
      const newProject = await Project.create(projectData);
      console.log(`Project created: ${newProject.name}`);
      return newProject;
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error("Failed to create project");
    }
  }

  static async updateProjectHandler(name: string, updatedProject: Project): Promise<number> {
    try {
      const [affectedRows] = await Project.update(updatedProject, {
        where: { name },
      });
      
      if (affectedRows === 0) {
        throw new Error(`No project found with name: ${name}`);
      }

      console.log(`Project "${name}" updated successfully`);
      return affectedRows;
    } catch (error) {
      console.error("Error updating project:", error);
      throw new Error(`Failed to update project: ${name}`);
    }
  }

  static async deleteProjectHandler(name: string): Promise<number> {
    try {
      const deletedProject = await Project.destroy({
        where: { name },
      });

      if (deletedProject === 0) {
        throw new Error(`No project found to delete with name: ${name}`);
      }

      console.log(`Project "${name}" deleted successfully`);
      return deletedProject;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error(`Failed to delete project: ${name}`);
    }
  }

  static async getAllProjectsHandler(): Promise<Project[]> {
    try {
      const allProjects = await Project.findAll();
      console.log(`Fetched ${allProjects.length} projects`);
      return allProjects;
    } catch (error) {
      console.error("Error fetching all projects:", error);
      throw new Error("Failed to fetch projects");
    }
  }

  static async findProjectByName(name: string): Promise<Project | null> {
    try {
      console.log("Finding project by name:", name);
      return await Project.findOne({ where: { name } });
    } catch (error) {
      console.error(`Error finding project with name "${name}":`, error);
      throw new Error(`Failed to find project with name: ${name}`);
    }
  }
}

export default ProjectHandler;
