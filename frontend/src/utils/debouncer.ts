import { searchLand } from "../store/slices/landSlice";
import { fetchLots, searchLotOnLandName } from "../store/slices/lotSlice";
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

export const debouncedLotSearch = debouncer(
  async (
    payload: { landName: string; status?: string },
    dispatch: AppDispatch
  ) => {
    try {
      if (!payload.landName && !payload.status) return;
      await dispatch(searchLotOnLandName(payload)).unwrap();
    } catch (error) {
      console.log("onSearchFilter error: ", error);
    }
  },
  400
);

export const debouncedLandSearch = debouncer(
  async (landName: string, dispatch: AppDispatch) => {
    try {
      await dispatch(searchLand(landName));
    } catch (error) {
      console.log("onSearchFilter error: ", error);
    }
  },
  400
);
