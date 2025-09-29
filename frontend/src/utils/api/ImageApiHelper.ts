import DefaultProfile from "../../icons/default-profile.svg";

export function renderImageOrDefault(id: string, fileName?: string): string {
  if (fileName) {
    return `http://localhost:4000/uploads/clients/${id}/${fileName}`;
  }
  return DefaultProfile;
}
