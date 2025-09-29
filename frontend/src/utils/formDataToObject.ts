export default function formDataToObject<T extends object>(
  formData: FormData
): Partial<T> {
  const obj: Partial<T> = {};

  formData.forEach((value, key) => {
    if (typeof value === "string") {
      // assign string values
      (obj as any)[key] = value;
    } else if (value instanceof File) {
      // assign file values (if your type expects them)
      (obj as any)[key] = value;
    }
  });

  return obj;
}
