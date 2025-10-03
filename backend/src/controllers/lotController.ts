import { Request, Response } from "express";
import { Lot } from "../model/lotModel";
import { LotRepository } from "../repo/lotRepository";
import { LotService } from "../service/lot.service";

export class LotController {
  constructor(private lotRepo: LotRepository) {}

  finLotById = async (req: Request, res: Response) => {
    const id = req.params.id;

    let lot: Lot | null = null; // default to null

    if (id) {
      lot = await this.lotRepo.findById(parseInt(id, 10));
    }

    res.json({ success: true, lot });
  };

  findLotsByLandId = async (req: Request, res: Response) => {
    const landId = req.params.landId;

    const lots = await this.lotRepo.findLotsByLandId(parseInt(landId, 10));

    res.json({ lots });
  };

  getLotsByIds = async (req: Request, res: Response) => {
    const { lotIds } = req.body;
    let parsedData = LotService.parseArrayIfNeeded(lotIds);

    const lotsRes: Lot[] = await this.lotRepo.getLotsByIds(parsedData);

    res.json({ lots: lotsRes });
  };

  getLots = async (req: Request, res: Response) => {
    const cursor = req.query.cursor as string | undefined;
    const lotStatus = req.query.status as string;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    console.log("status: ", lotStatus);

    const response = await this.lotRepo.findAllPaginated({
      cursor,
      limit,
      filterStatus: lotStatus,
    });

    res.json({
      success: true,
      message: "Lots fetched",
      ...response,
    });
  };

  searchLotsByLandName = async (req: Request, res: Response) => {
    const landName = req.query.landName as string;
    const lotStatus = req.query.status as string;

    const lots = await this.lotRepo.searchLotsByLandName({
      landName,
      status: lotStatus,
    });

    res.json({
      success: true,
      message: "Lots fetched by land name",
      lots,
    });
  };

  update = async (req: Request, res: Response) => {
    const _id = req.params._id;
    const lotData = LotService.filterOutProp({
      data: req.body,
      keys: ["name"],
    });

    await this.lotRepo.update({ _id: parseInt(_id, 10), lot: lotData });
    res.json({ success: true });
  };

  deleteLot = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    await this.lotRepo.delete(id);
    res.json({ success: true, message: `Lot ${id} deleted successfully` });
  };
}
