import { Database } from "sqlite";
import { Client } from "../model/clientModel";
import { UploadService } from "../service/UploadService";
import { AppService } from "../service/applictionService";

export class ClientRepository {
  constructor(private db: Database) {}

  async saveClientPhoto(clientId: number, file?: Express.Multer.File) {
    const fileName = await UploadService.saveClientProfileIfExist(
      clientId,
      file
    );
    await this.updateClientPhoto(clientId, fileName);
    return fileName;
  }

  async updateClientPhoto(clientId: number, fileName?: string): Promise<void> {
    if (fileName) {
      await this.db.run(`UPDATE Client SET profilePicc = ? WHERE _id = ?`, [
        fileName,
        clientId,
      ]);
    }
  }

  async create(
    client: Client
  ): Promise<{ success: boolean; message?: string; client?: Client }> {
    if (await this.doesEmailExist(client.email!)) {
      return { success: false, message: "Email Already Exist" };
    }

    const result = await this.db.run(
      `INSERT INTO Client 
        (profilePicc, firstName, middleName, lastName, email, contact, Marital, address, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        client.profilePicc,
        client.firstName,
        client.middleName,
        client.lastName,
        client.email,
        client.contact,
        client.Marital,
        client.address,
        client.status,
      ]
    );

    return { client: { _id: result.lastID, ...client }, success: true };
  }

  async update(
    id: number,
    updates: Partial<Client>
  ): Promise<{ client?: Client; success: boolean; message?: string }> {
    const fields = Object.keys(updates);
    if (fields.length === 0)
      return { success: true, message: "No field needed to change" };

    if (updates.email && (await this.doesEmailExist(updates.email))) {
      return {
        success: false,
        message: "This email is connected in another account",
      };
    }

    const setClause = fields.map((f) => `${f} = ?`).join(", ");
    const values = Object.values(updates);

    await this.db.run(`UPDATE Client SET ${setClause} WHERE _id = ?`, [
      ...values,
      id,
    ]);

    const clientDataRes = await this.findById(id);

    if (!clientDataRes.success) {
      return { success: false, message: "Failed to find client after adding" };
    }

    return { success: true, client: clientDataRes.client };
  }

  async doesEmailExist(email: string): Promise<boolean> {
    // return true if email exist
    return Boolean(
      await this.db.get(`SELECT * FROM Client WHERE  email = ?`, [email])
    );
  }

  async searchClientByName(payload: {
    query?: string;
    status?: string;
  }): Promise<Client[]> {
    const { query, status } = payload;
    // Base query
    let sql = `
    SELECT *
    FROM Client
    WHERE 1=1
  `;

    const params: any[] = [];

    // Add query filter (search by first, middle, last name)
    if (query) {
      sql += `
      AND (
        firstName LIKE ?
        OR middleName LIKE ?
        OR lastName LIKE ?
      )
    `;
      const likeQuery = `%${query}%`;
      params.push(likeQuery, likeQuery, likeQuery);
    }

    // Add status filterp
    if (status) {
      sql += ` AND status = ? `;
      params.push(status);
    }

    // Order results
    sql += ` ORDER BY createdAt DESC `;

    // Execute
    const rows = await this.db.all<Client[]>(sql, params);
    return rows;
  }

  async delete(id: number): Promise<{ success: boolean; message?: string }> {
    const doesClientHasTansaction = await AppService.doesClientHasApplication(
      this.db,
      id.toString()
    );

    if (doesClientHasTansaction) {
      return {
        success: false,
        message:
          "This client cannot be deleted because they are associated with an existing application.",
      };
    }

    await this.db.run("DELETE FROM Client WHERE _id = ?", [id]);
    return { success: true };
  }

  async findById(
    id: number
  ): Promise<{ success: boolean; client?: Client; message?: string }> {
    const clientData = await this.db.get<Client>(
      "SELECT * FROM Client WHERE _id = ?",
      [id]
    );

    if (!clientData) {
      return { success: false, message: "Cannot find client" };
    }

    return { success: true, client: clientData };
  }

  async findAll(): Promise<Client[]> {
    return await this.db.all<Client[]>(
      "SELECT * FROM Client ORDER BY createdAt DESC"
    );
  }
}
