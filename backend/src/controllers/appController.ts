import { Request, Response } from "express";
import { ApplicationRepo } from "../repo/appRepository";
import { ApplicationType } from "../model/applicationModel";

export class AppController {
  constructor(private appRepo: ApplicationRepo) {}

  // Create new application
  addNewApp = async (req: Request, res: Response): Promise<void> => {
    try {
      const applicationData: ApplicationType = req.body;

      console.log("application data: ", applicationData, req.body);

      const createdApp = await this.appRepo.create(applicationData);

      console.log("created data: ", createdApp);

      if (!createdApp) {
        res.json({
          success: false,
          message: "Failed to create application",
        });
        return;
      }

      res.json({
        success: true,
        message: "Application created successfully",
        data: createdApp,
      });
    } catch (error) {
      console.error("Error creating application:", error);
      res.json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  // Get application by ID
  getAppById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const appId = parseInt(id, 10);

      if (isNaN(appId)) {
        res.json({
          success: false,
          message: "Invalid application ID",
        });
        return;
      }

      const application = await this.appRepo.findById(appId);

      if (!application) {
        res.json({
          success: false,
          message: "Application not found",
        });
        return;
      }

      res.json({
        success: true,
        data: application,
      });
    } catch (error) {
      console.error("Error fetching application:", error);
      res.json({
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  fetchAllApp = async (_: Request, res: Response): Promise<void> => {
    const response = await this.appRepo.getAll();

    res.json({ applications: response });
  };
}
