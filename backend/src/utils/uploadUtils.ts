export const validateUserId = (userId: string): void => {
  if (!userId || userId.includes("..")) {
    throw new Error("Invalid user ID format");
  }
};

export const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1e5);
  return `${timestamp}-${random}-${originalName}`;
};
