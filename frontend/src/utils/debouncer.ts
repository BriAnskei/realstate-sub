import { searchLotOnLandName } from "../store/slices/lotSlice";
import { AppDispatch } from "../store/store";

export function debouncer<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const debouncedSearch = debouncer(
  async (query: string, dispatch: AppDispatch) => {
    try {
      if (!query) return;
      const res = await dispatch(searchLotOnLandName(query)).unwrap();
      console.log("component res: ", res);
    } catch (error) {
      console.log("onSearchFilter error: ", error);
    }
  },
  400
);
