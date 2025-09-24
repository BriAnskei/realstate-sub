import { Database } from "sqlite";
import { Client } from "../model/clientModel";

export class ClientRepository {
  constructor(private db: Database) {}

  async create(client: Client): Promise<Client> {
    const result = await this.db.run(
      `INSERT INTO Client 
        (validIdPicc, firstName, middleName, lastName, email, contact, Marital, balance, address, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client.validIdPicc,
        client.firstName,
        client.middleName,
        client.lastName,
        client.email,
        client.contact,
        client.Marital,
        client.balance ?? 0,
        client.address,
        client.status,
      ]
    );

    return { _id: result.lastID, ...client };
  }

  async findById(id: number): Promise<Client | undefined> {
    return this.db.get<Client>("SELECT * FROM Client WHERE _id = ?", [id]);
  }

  async findAll(): Promise<Client[]> {
    return this.db.all<Client[]>("SELECT * FROM Client");
  }

  async update(
    id: number,
    updates: Partial<Client>
  ): Promise<Client | undefined> {
    const fields = Object.keys(updates);
    if (fields.length === 0) return this.findById(id);

    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const values = Object.values(updates);

    await this.db.run(`UPDATE Client SET ${setClause} WHERE _id = ?`, [
      ...values,
      id,
    ]);

    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.db.run("DELETE FROM Client WHERE _id = ?", [id]);
  }
}
