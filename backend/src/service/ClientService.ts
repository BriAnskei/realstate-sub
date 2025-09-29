import { Request } from "express";
import { Client } from "../model/clientModel";

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
}
