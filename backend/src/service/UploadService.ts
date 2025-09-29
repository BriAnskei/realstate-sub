import path from "path";

import fs from "fs";
import { FileManager } from "../middleware/multer/FileManager";
import { PathBuilder } from "../middleware/multer/PathBuilder";
import { StorageConfig } from "../middleware/multer/StorageConfig";
import { UploadMiddlewareFactory } from "../middleware/multer/UploadMiddlewareFactory";
import { generateUniqueFileName } from "../utils/uploadUtils";

export class UploadService {
  static readonly clients = {
    temp: UploadMiddlewareFactory.createFileUploadMiddleware(
      StorageConfig.createMemoryStorage(),
      "profilePicc"
    ),
  };

  static async saveClientProfileIfExist(
    clientId: number,
    file?: Express.Multer.File
  ): Promise<string | undefined> {
    if (!clientId)
      throw new Error("No client id has been passed by controller");

    if (file) {
      const uploadPath = PathBuilder.buildClientUploadPath(clientId.toString());
      const fileName = generateUniqueFileName(file.originalname);
      const fullPath = path.join(uploadPath, fileName);

      await FileManager.ensureDirectoryExists(uploadPath);
      await fs.promises.writeFile(fullPath, file.buffer);

      return fileName;
    }

    return undefined;
  }
}
