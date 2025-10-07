import { Database } from "sqlite";
import { ReserveType } from "../model/reserationModel";

export class ReserveRepo {
  constructor(private db: Database) {}

  async create(reservation: ReserveType): Promise<ReserveType | undefined> {
    const reserveResult = await this.db.run(
      `
                INSERT INTO Reservation (
                    applicationId, clientName, status, notes)
                    VALUES (?, ?, ?, ?) 
            `,
      [
        reservation.applicationId
          ? JSON.stringify(reservation.applicationId)
          : null,
        reservation.clientName,
        reservation.status ?? "pending",
        reservation.notes ?? null,
      ]
    );

    const reserveId = reserveResult.lastID!;
    const createdReserve = await this.findById(reserveId);

    console.log("creation result: ", createdReserve);

    return createdReserve;
  }

  async findById(id: number): Promise<ReserveType | undefined> {
    const row = await this.db.get<ReserveType>(
      `SELECT * FROM Reservation WHERE reserveId = ?`,
      [id]
    );

    if (!row) return undefined;

    return {
      ...row,
      applicationId: row.applicationId
        ? JSON.parse(row.applicationId as unknown as string)
        : [],
    };
  }

  async findAll(): Promise<ReserveType[]> {
    const rows = await this.db.all<ReserveType[]>(
      `SELECT * FROM Reservation ORDER BY createdat DESC`
    );

    return rows.map((row) => ({
      ...row,
      applicationId: row.applicationId
        ? JSON.parse(row.applicationId as unknown as string)
        : [],
    }));
  }

  async update(
    id: number,
    updates: Partial<Omit<ReserveType, "id" | "createdAt">>
  ): Promise<ReserveType | undefined> {
    const exsitingReserve = await this.findById(id);
    if (!exsitingReserve) {
      return undefined;
    }

    const setClause: string[] = [];
    const values: any[] = [];

    if (updates.applicationId !== undefined) {
      setClause.push("applicationId = ?");
      values.push(
        updates.applicationId ? JSON.stringify(updates.applicationId) : null
      );
    }

    if (updates.clientName !== undefined) {
      setClause.push("clientName = ?");
      values.push(updates.clientName);
    }

    if (updates.status !== undefined) {
      setClause.push("status = ?");
      values.push(updates.status);
    }

    if (updates.notes !== undefined) {
      setClause.push("notes = ?");
      values.push(updates.notes);
    }

    if (setClause.length === 0) {
      return exsitingReserve;
    }

    values.push(id);

    await this.db.run(
      `UPDATE Reservation SET ${setClause.join(", ")} WHERE reserveId = ?`,
      values
    );

    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db.run(
      `DELETE FROM Reservation WHERE reserveId = ?`,
      [id]
    );

    return result.changes !== undefined && result.changes > 0;
  }
}
