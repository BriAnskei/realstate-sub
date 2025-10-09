import multer from "multer";
import { PathBuilder } from "./PathBuilder";
import { FileManager } from "./FileManager";
import { generateUniqueFileName } from "../../utils/uploadUtils";
import { Request } from "express";
import { MulterRequest } from "./Types";

export class StorageConfig {
  static creatClientStorage(): multer.StorageEngine {
    return multer.diskStorage({
      destination: async (req, file, callback) => {
        try {
          const clientId = req.body.clientId;

          if (!clientId) {
            throw new Error("User ID is required");
          }

          const uploadPath = PathBuilder.buildClientUploadPath(clientId);
          await FileManager.ensureDirectoryExists(uploadPath);
          callback(null, uploadPath);
        } catch (error) {
          callback(error as Error, "");
        }
      },

      filename(req, file, callback) {
        const uniqueName = generateUniqueFileName(file.originalname);
        callback(null, uniqueName);
      },
    });
  }

  static createContractPdfStorage(): multer.StorageEngine {
    return multer.diskStorage({
      destination: async (req, file, callback) => {
        try {
          const contractId = req.body.contractId;
          if (!contractId) throw new Error("Contract ID is required");

          const uploadPath = PathBuilder.buildContractPdfPath(contractId);
          await FileManager.ensureDirectoryExists(uploadPath);

          callback(null, uploadPath);
        } catch (error) {
          callback(error as Error, "");
        }
      },
      filename(req, file, callback) {
        const uniqueName = generateUniqueFileName(file.originalname);
        callback(null, uniqueName);
      },
    });
  }

  static createMemoryStorage(): multer.StorageEngine {
    return multer.memoryStorage();
  }
}
