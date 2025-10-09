import { UPLOAD_PATHS } from "./UploadPaths";
import { validateUserId } from "../../utils/uploadUtils";
import path from "path";

export class PathBuilder {
  static buildClientUploadPath(userId: string): string {
    validateUserId(userId);
    return path.join(UPLOAD_PATHS.CLIENTS, userId);
  }

  static buildContractPdfPath(contractId: string): string {
    if (!contractId) throw new Error("Contract ID is required");
    return path.join(UPLOAD_PATHS.PDF, contractId);
  }
}
