export class LotService {
  static parseArrayIfNeeded(data: any) {
    if (typeof data === "string") {
      return JSON.parse(data);
    }
    return data;
  }
  static filterOutProp<T extends Record<string, any>>(payload: {
    data: T;
    keys: string[];
  }): Partial<T> {
    const { data, keys } = payload;

    return Object.fromEntries(
      Object.entries(data).filter(([key]) => !keys.includes(key))
    ) as Partial<T>;
  }
}
