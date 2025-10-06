import { Request, Response } from "express";
import { ApplicationRepo } from "../repo/appRepository";
import { ApplicationType } from "../model/applicationModel";
import { LotService } from "../service/lot.service";

export class AppController {
  constructor(private appRepo: ApplicationRepo) {}

  addNewApp = async (req: Request, res: Response): Promise<void> => {
    const applicationData: ApplicationType = req.body;

    const createdApp = await this.appRepo.create(applicationData);

    res.json({
      ...createdApp,
    });
  };

  getRejectedApplictionByAgentId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const agentId = req.body.agentId;
    console.log("agentId,d", agentId);
    const fetchedApplication =
      await this.appRepo.getRejectedApplicationsByAgentId(agentId);

    res.json({
      application: fetchedApplication,
    });
  };

  /**
   *
   * @enum agents users
   * @param req
   * @param res
   */
  updateApplication = async (req: Request, res: Response): Promise<void> => {
    const _id = req.params._id;
    const ApplicationData = req.body;
    console.log("Updating appliction: ", ApplicationData);
    const isSuccess: boolean = await this.appRepo.update({
      applicationId: _id,
      data: ApplicationData,
    });
    res.json({ success: isSuccess });
  };

  updateApplicationStatus = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { status, rejectionNote } = req.body;

    await this.appRepo.updateStatus({
      applicationId: req.params._id,
      status: status,
      rejectionNote: rejectionNote,
    });

    res.json({ success: true });
  };

  /**
   *
   * @param req
   * @param res
   * @eturns application dedicated to agent via application dealer or other agents
   */
  getAppByAgent = async (req: Request, res: Response): Promise<void> => {
    const agentId = req.params._id;

    const response = await this.appRepo.getApplicationsByAgent(agentId);

    // convert stringified array to pure array(if needed)
    const parsedData = response.map((app) => {
      return {
        ...app,
        otherAgentIds: LotService.parseArrayIfNeeded(app.otherAgentIds),
        lotIds: LotService.parseArrayIfNeeded(app.lotIds),
      };
    });
    res.json({ applications: parsedData });
  };

  /**
   *
   * @param req
   * @returnes filtered(on search) application for agents types user
   */
  getFilteredAppsByAgents = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const agentId = req.params._id;
    const { searchQuery, status } = req.query;

    const filterResult = await this.appRepo.getFilteredData({
      ...(agentId !== "undefined" && { agentId }),
      filters: { search: searchQuery as string, status: status as string },
    });

    res.json({ applications: filterResult });
  };

  getAppById = async (req: Request, res: Response): Promise<void> => {
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
  };

  fetchAllApp = async (_: Request, res: Response): Promise<void> => {
    const response = await this.appRepo.getAll();
    res.json({ applications: response });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const response = await this.appRepo.delete(req.params._id);
    res.json({ success: response });
  };
}
