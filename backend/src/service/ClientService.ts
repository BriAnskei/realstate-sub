import { Request } from "express";
import { Client } from "../model/clientModel";
import { Database } from "sqlite";

export class ClientService {
  static buildCreationPayload(req: Request): Client {
    return {
      firstName: req.body.firstName,
      middleName: req.body.middleName,
      lastName: req.body.lastName,
      email: req.body.email,
      contact: req.body.contact,
      Marital: req.body.Marital,
      address: req.body.address,
      status: req.body.status,
    };
  }
  static async fintById(
    db: Database,
    clientId: string
  ): Promise<Client | undefined> {
    return await db.get<Client>("SELECT * FROM Client WHERE _id = ?", [
      clientId,
    ]);
  }
}
