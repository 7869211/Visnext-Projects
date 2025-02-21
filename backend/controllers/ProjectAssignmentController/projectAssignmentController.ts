import { Request, Response } from "express";
import ProjectAssignmentManager from "./projectAssignmentManager";
import constants from "../../constants";
import User from "../../models/User";
import ProjectAssignmentHandler from "../../handlers/ProjectAssignmentHandler";

const { ErrorCodes } = constants;

class ProjectAssignmentController {
  static async assignUsersToProject(req: Request, res: Response): Promise<void> {
    try {
      const projectId = Number(req.params.projectId);
      const { userIds } = req.body;

      const validUsers = await User.findAll({
        where: {
          id: userIds,
          userType: ['developer', 'QA'],
        },
      });

      if (validUsers.length !== userIds.length) {
        console.log("controller::validuser", validUsers);
        res.status(ErrorCodes.DOCUMENT_NOT_FOUND).json({ success: false, message: 'Invalid user roles to assign' });
        return;
      }

      console.log("from controller::body and projectid::", req.body, projectId);

      if (!projectId || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(ErrorCodes.BAD_REQUEST).json({ success: false, message: "Invalid project ID or user IDs." });
        return;
      }

      const assignedProjects = await ProjectAssignmentManager.assignUsersToProject(projectId, userIds);

      res.status(ErrorCodes.SUCCESS).json({
        success: true,
        data: assignedProjects,
        message: "Users assigned to the project successfully.",
      });
    } catch (error) {
      console.error("from controller::Error assigning users to project:", error);
      res.status(ErrorCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to assign users to project." });
    }
  }

  static async getAllAssignments(req: Request, res: Response): Promise<void> {
    try {
      const assignments = await ProjectAssignmentHandler.getAllAssignmentsHandler();

      res.status(ErrorCodes.SUCCESS).json({
        success: true,
        data: assignments || [],
        message: assignments?.length ? "All project assignments fetched" : "No project assignments found",
      });
    } catch (error) {
      console.error("Controller: Error fetching project assignments", error);

      res.status(ErrorCodes.BAD_REQUEST).json({
        success: false,
        message: "Failed to fetch project assignments",
      });
    }
  }

  static async getAssignedProjectsForUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = Number(req.params.userId);

      const projects = await ProjectAssignmentManager.getAssignedProjectsForUser(userId);

      res.status(ErrorCodes.SUCCESS).json({
        success: true,
        data: projects,
        message: "Assigned projects fetched successfully",
      });
    } catch (error: any) {
      console.error("Error fetching projects for user:", error);
      const statusCode = error.message.includes("not found") || error.message.includes("mismatch")
        ? ErrorCodes.DOCUMENT_NOT_FOUND
        : ErrorCodes.INTERNAL_SERVER_ERROR;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Server error",
      });
    }
  }
}

export default ProjectAssignmentController;
