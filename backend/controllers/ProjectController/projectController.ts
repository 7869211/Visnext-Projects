import ProjectManager from "./projectManager";
import Project from "../../models/Project";
import { InferCreationAttributes } from "@sequelize/core";
import User from "../../models/User";
import { Request, Response } from "express";
import constants from "../../constants";

const { ErrorCodes } = constants;

type AuthRequest = Request & { user?: User };

class ProjectController {
  static async createProject(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { name, description } = req.body;

      if (!req.user || !req.user.id) {
        res.status(ErrorCodes.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized access. User information is missing.",
        });
        return;
      }

      const managerId = req.user.id;

      const projectData = {
        name,
        description,
        managerId,
      };

      const createdProject = await ProjectManager.createProject(projectData);

      res.status(ErrorCodes.SUCCESS).json({
        success: true,
        data: createdProject,
        message: "Project created successfully",
      });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(ErrorCodes.BAD_REQUEST).json({
        success: false,
        message: "Error creating the project",
      });
    }
  }

  static async updateProject(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      if (!name) {
        res.status(ErrorCodes.BAD_REQUEST).json({
          success: false,
          message: "Project name is required in the route parameters.",
        });
        return;
      }

      console.log("from controller:: body:", req.body);
      const updatedProject = await ProjectManager.updateProject(name, req.body);

      if (!updatedProject) {
        res.status(ErrorCodes.DOCUMENT_NOT_FOUND).json({
          success: false,
          message: `Project with name "${name}" not found.`,
        });
        return;
      }

      res.status(ErrorCodes.SUCCESS).json({
        success: true,
        data: updatedProject,
        message: "Project updated successfully.",
      });
    } catch (error) {
      console.error("from controller:: error in updating the project", error);
      res.status(ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update the project.",
      });
    }
  }

  static async deleteProject(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      if (!name) {
        res.status(ErrorCodes.BAD_REQUEST).json({
          success: false,
          message: "Project name is required in the route parameters.",
        });
        return;
      }

      console.log("from controller:: name:", name);
      const deletedProject = await ProjectManager.deleteProject(name);

      if (!deletedProject) {
        res.status(ErrorCodes.DOCUMENT_NOT_FOUND).json({
          success: false,
          message: `Project with name "${name}" not found.`,
        });
        return;
      }

      res.status(ErrorCodes.SUCCESS).json({
        success: true,
        data: deletedProject,
        message: "Project deleted successfully.",
      });
    } catch (error) {
      console.error("from controller:: error in deleting the project!", error);
      res.status(ErrorCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Error in deleting the project.",
      });
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      console.log("from controller:: get all called");
      const allProjects = await ProjectManager.getAllProjects();
      res.status(ErrorCodes.SUCCESS).json({
        success: true,
        data: allProjects,
        message: "All projects fetched",
      });
    } catch {
      console.log("Error in fetching all projects!");
      res.status(ErrorCodes.BAD_REQUEST).json({
        success: false,
        message: "Error in fetching all projects",
      });
    }
  }

  static async searchForProject(req: Request, res: Response): Promise<void> {
    try {
      console.log("controller:: search for project:", req.body.name);
      const searchedProject = await ProjectManager.searchForProject(req.body.name);
      res.status(ErrorCodes.SUCCESS).json({
        success: true,
        data: searchedProject,
        message: "Searched successfully",
      });
    } catch {
      console.log("from controller:: error in searching");
      res.status(ErrorCodes.BAD_REQUEST).json({
        success: false,
        data: req.body.name,
        message: "Error in search",
      });
    }
  }
}

export default ProjectController;
