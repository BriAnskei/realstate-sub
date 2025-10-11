import { Database } from "sqlite";
import { ContractType } from "../model/contractModel";
import { PdfService } from "../service/pdfGenerator";
import { LotService } from "../service/lot.service";
import { AppService } from "../service/applictionService";
import { UploadService } from "../service/UploadService";
import { ReservationService } from "../service/reseervationService";
import { ApplicationType } from "../model/applicationModel";
import { ReserveType } from "../model/reserationModel";

export class ContractRepository {
  constructor(private db: Database) {}

  /**
   * Add a new contract to the database.
   * @param payload - Contract data (without _id or createdAt)
   */
  async addContract(
    payload: Omit<ContractType, "_id" | "createdAt">
  ): Promise<ContractType> {
    const {
      clientId,
      agentsIds,
      applicationId,
      contractPDF,
      reservationId,
      term,
      clientName, // ✅ Added clientName to payload
    } = payload;

    try {
      await this.db.exec("BEGIN TRANSACTION");

      const res = await this.db.run(
        `
        INSERT INTO Contract (clientId, agentsIds, applicationId, reservationId,  contractPDF, term, clientName)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
          clientId ?? null,
          JSON.stringify(agentsIds), // Store array as JSON string
          applicationId ?? null,
          reservationId,
          contractPDF ?? null,
          term ?? null,
          clientName ?? null, // ✅ Save clientName
        ]
      );

      const createdContract = await this.findById(res.lastID!);

      if (!createdContract) {
        throw new Error("Cannot find created contract");
      }

      await this.processRervationOnContract(applicationId!);
      await this.db.exec("COMMIT");

      return createdContract;
    } catch (error) {
      await this.db.exec("ROLLBACK");
      throw error;
    }
  }

  private async processRervationOnContract(applicationId: string) {
    try {
      const application = await AppService.findById(
        this.db,
        parseInt(applicationId, 10)
      );

      if (!application) throw new Error("Cannot find application");

      await ReservationService.updateReservationStatus(this.db, {
        applicationId: application._id!,
        status: "on contract",
      });

      await LotService.setLotsStatus(this.db, {
        lotIds: application.lotIds,
        status: "sold",
      });
    } catch (error) {
      throw new Error("Error  in processRservationOnContract" + error);
    }
  }

  /**
   * Search contracts by client name (case-insensitive),
   * optionally filter by agentId (if provided).
   */
  async searchContractsByClientName(payload: {
    name: string;
    agentId?: string;
  }): Promise<ContractType[]> {
    const { name, agentId } = payload;

    let sql = `
    SELECT * FROM Contract
    WHERE LOWER(clientName) LIKE LOWER(?)
  `;
    const params: any[] = [`%${name}%`];

    // If agentId exists, add a filter for it in the JSON agentsIds column
    if (agentId) {
      sql += ` AND json_extract(agentsIds, '$') LIKE ?`;
      params.push(`%${agentId}%`);
    }

    sql += ` ORDER BY createdAt DESC`;

    const rows = await this.db.all(sql, params);

    return rows.map((row) => ({
      ...row,
      agentsIds: row.agentsIds ? JSON.parse(row.agentsIds) : [],
    }));
  }

  async handleContractPdfFileUploader(contract: ContractType): Promise<{
    fileName: string;
    application: ApplicationType;
    reservation: ReserveType;
  }> {
    const file = await this.processBuffedFile({
      applicationId: contract.applicationId!,
      clientId: contract.clientId!,
      term: contract.term!,
      contractId: contract._id,
    });

    const fileName = await UploadService.saveContractPdf(
      contract._id.toString(),
      file
    );
    await this.updateContractPdf(contract._id, fileName);

    const otherRelation = await this.getContractContractRelation(contract);

    return { fileName, ...otherRelation };
  }

  async getContractContractRelation(
    contract: ContractType
  ): Promise<{ application: ApplicationType; reservation: ReserveType }> {
    const application = await AppService.findById(
      this.db,
      parseInt(contract.applicationId!, 10)
    );
    const reservation = await ReservationService.findReservationByApplicationId(
      this.db,
      contract.applicationId!
    );

    if (!application || !reservation) {
      const notFound = !application ? "application" : "reservation";
      throw new Error(`Cannot find ${notFound}`);
    }

    return { application, reservation };
  }

  private async processBuffedFile(payload: {
    applicationId: string;
    clientId: string;
    term: string;
    contractId: string;
  }) {
    const { applicationId, clientId, term, contractId } = payload;
    const pdfBuffer = await PdfService.generateContractPDF(this.db, {
      applicationId,
      clientId,
      term,
    });

    const file: Express.Multer.File = {
      buffer: pdfBuffer,
      originalname: `contract-${contractId}.pdf`,
      mimetype: "application/pdf",
      // Add other required properties (multer usually sets these)
      fieldname: "contractPdf",
      encoding: "7bit",
      size: pdfBuffer.length,
      stream: null as any,
      destination: "",
      filename: "",
      path: "",
    };

    return file;
  }

  async updateContractPdf(contractId: string, fileName: string): Promise<void> {
    await this.db.run(`UPDATE Contract SET contractPDF = ? WHERE _id = ?`, [
      fileName,
      contractId,
    ]);
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
    console.log("Fetching contract by agent id: ", agentId);
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

  async getGeneratedPdf(payload: {
    clientId: string;
    applicationId: string;
    term: string;
  }) {
    const generatedPdf = await PdfService.generateContractPDF(this.db, payload);

    return generatedPdf;
  }

  /**
   * Find contract by ID.
   * @param id - The contract ID.p
   */
  async findById(id: number): Promise<ContractType | null> {
    const row = await this.db.get(`SELECT * FROM Contract WHERE _id = ?`, [id]);

    if (!row) return null;

    return {
      ...row,
      agentsIds: row.agentsIds ? JSON.parse(row.agentsIds) : [],
    };
  }
}
