import multer from "multer";

export class UploadMiddlewareFactory {
  static createFileUploadMiddleware(
    storage: multer.StorageEngine,
    fieldName: string
  ) {
    const upload = multer({ storage });
    return upload.single(fieldName);
  }
}
