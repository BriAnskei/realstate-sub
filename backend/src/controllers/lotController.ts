import { Request, Response } from "express";
import { Lot } from "../model/lotModel";
import { LotRepository } from "../repo/lotRepository";

export class LotController {
  constructor(private lotRepo: LotRepository) {}

  deleteLot = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    await this.lotRepo.delete(id);
    res.json({ success: true, message: `Lot ${id} deleted successfully` });
  };

  finLotById = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const lots = this.lotRepo.findById(id);
    res.json({ success: true, lots });
  };

  getLots = async (req: Request, res: Response) => {
    const cursor = req.query.cursor as string | undefined;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    console.log("gets lots");

    const response = await this.lotRepo.findAllPaginated({ cursor, limit });

    res.json({
      success: true,
      message: "Lots fetched",
      ...response,
    });
  };

  searchLotsByLandName = async (req: Request, res: Response) => {
    const landName = req.query.name as string;
    const lots = await this.lotRepo.searchLotsByLandName(landName);

    res.json({
      success: true,
      message: "Lots fetched by land name",
      lots,
    });
  };
}
