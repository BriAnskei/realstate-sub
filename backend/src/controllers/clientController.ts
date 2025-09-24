import { ClientRepository } from "../repo/clientRepository";
import { Request, Response } from "express";

export class ClientController {
  constructor(private clientRepo: ClientRepository) {}

  create = async (req: Request, res: Response) => {
    const client = await this.clientRepo.create(req.body);
    res.status(201).json(client);
  };

  getClientById = async (req: Request, res: Response) => {
    const client = await this.clientRepo.findById(Number(req.params.id));
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  };

  getClients = async (_req: Request, res: Response) => {
    const clients = await this.clientRepo.findAll();
    res.json(clients);
  };

  updateClient = async (req: Request, res: Response) => {
    const updated = await this.clientRepo.update(
      Number(req.params.id),
      req.body
    );
    if (!updated) return res.status(404).json({ message: "Client not found" });
    res.json(updated);
  };

  deleteClient = async (req: Request, res: Response) => {
    await this.clientRepo.delete(Number(req.params.id));
    res.json({ message: "Client deleted successfully" });
  };
}
