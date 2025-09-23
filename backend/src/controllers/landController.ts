import { Request, Response } from "express";
import { LandRepository } from "../repo/landRepository";
import { Land } from "../model/landModel";

export class LandController {
  constructor(private landRepo: LandRepository) {}

  getAllLands = async (_: Request, res: Response) => {
    const lands = await this.landRepo.findAll();
    res.json(lands);
  };

  searchByName = async (req: Request, res: Response) => {
    const landName = req.query.landName as string;
    console.log("seached name: ", landName);

    const lands: Land[] = await this.landRepo.findByName(landName);

    console.log("found: ", lands);

    res.json({ lands });
  };

  newLandAndLots = async (req: Request, res: Response) => {
    const land = req.body.landData;
    const lot = req.body.lots;

    const response = await this.landRepo.createLandWithLots(land, lot);

    res.json({ ...response });
  };
  updateLand = async (req: Request, res: Response) => {
    const id = parseInt(req.params._id, 10);
    const updatedLand = await this.landRepo.update(id, req.body);
    res.json(updatedLand);
  };

  findOne = async (req: Request, res: Response) => {
    const id = parseInt(req.params._id, 10);
    const land = await this.landRepo.findById(id);
    res.json(land);
  };

  delete = async (req: Request, res: Response) => {
    const id = parseInt(req.body._id, 10);
    const land = await this.landRepo.delete(id);
    res.json(land);
  };
}
