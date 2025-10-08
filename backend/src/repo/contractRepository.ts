import { Database } from "sqlite";
import { ContractType } from "../model/contractModel";

export class ContractRepository {
  constructor(private db: Database) {}

  /**
   * Add a new contract to the database.
   * @param payload - Contract data (without _id or createdAt)
   */
  async addContract(
    payload: Omit<ContractType, "_id" | "createdAt">
  ): Promise<void> {
    const { clientId, agentsIds, applicaitonId, contractPDF, term } = payload;

    await this.db.run(
      `
      INSERT INTO Contract (clientId, agentsIds, applicaitonId, contractPDF, term, createdAt)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      [
        clientId ?? null,
        JSON.stringify(agentsIds), // Store array as JSON string
        applicaitonId ?? null,
        contractPDF ?? null,
        term ?? null,
      ]
    );
  }

  /**
   * Fetch all contracts.
   * @returns Array of all contracts
   */
  async fetchAllContracts(): Promise<ContractType[]> {
    const rows = await this.db.all(`
      SELECT * FROM Contract
      ORDER BY createdAt DESC
    `);

    // Parse JSON fields
    return rows.map((row) => ({
      ...row,
      agentsIds: row.agentsIds ? JSON.parse(row.agentsIds) : [],
    }));
  }

  /**
   * Fetch all contracts by a specific agent ID.
   * @param agentId - The agent ID to filter contracts by.
   * @returns Array of matching contracts.
   */
  async fetchContractsByAgentId(agentId: string): Promise<ContractType[]> {
    const rows = await this.db.all(
      `
      SELECT * FROM Contract
      WHERE json_extract(agentsIds, '$') LIKE ?
      ORDER BY createdAt DESC
    `,
      [`%${agentId}%`]
    );

    return rows.map((row) => ({
      ...row,
      agentsIds: row.agentsIds ? JSON.parse(row.agentsIds) : [],
    }));
  }

  /**
   * Find contract by ID.
   * @param id - The contract ID.
   */
  async findById(id: string): Promise<ContractType | null> {
    const row = await this.db.get(`SELECT * FROM Contract WHERE _id = ?`, [id]);

    if (!row) return null;

    return {
      ...row,
      agentsIds: row.agentsIds ? JSON.parse(row.agentsIds) : [],
    };
  }
}
