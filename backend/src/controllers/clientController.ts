import { ClientRepository } from "../repo/clientRepository";
import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";
import { FileManager } from "../middleware/multer/FileManager";
import { PathBuilder } from "../middleware/multer/PathBuilder";
import { generateUniqueFileName } from "../utils/uploadUtils";

import { ClientService } from "../service/ClientService";

export class ClientController {
  constructor(private clientRepo: ClientRepository) {}

  async create(req: Request, res: Response) {
    const clientData = ClientService.buildCreationPayload(req);
    let repoRespose = await this.clientRepo.create(clientData);

    let { success, client } = repoRespose;

    if (!success) {
      // posible causes if this is email already existj
      return res.json({ ...repoRespose });
    }

    const fileName = await this.clientRepo.saveClientPhoto(
      client?._id!,
      req.file
    );

    // if file exist and client is saved add the filename to corresponding prop
    if (fileName && client) {
      client = { ...client, profilePicc: fileName };
      repoRespose = { ...repoRespose, client: client };
    }

    res.json({ ...repoRespose });
  }

  getClientById = async (req: Request, res: Response) => {
    const response = await this.clientRepo.findById(Number(req.params.id));

    res.json({ ...response });
  };

  getClients = async (_req: Request, res: Response) => {
    const clients = await this.clientRepo.findAll();
    res.json(clients);
  };

  updateClient = async (req: Request, res: Response) => {
    const response = await this.clientRepo.update(
      Number(req.params.id),
      req.body
    );

    res.json({ ...response });
  };

  deleteClient = async (req: Request, res: Response) => {
    await this.clientRepo.delete(Number(req.params.id));
    res.json({ message: "Client deleted successfully" });
  };

  search = async (req: Request, res: Response) => {
    const response = await this.clientRepo.searchClientByName({
      query: req.query.name as string,
      status: req.query.status as string,
    });

    res.json({ clients: response });
  };
}
