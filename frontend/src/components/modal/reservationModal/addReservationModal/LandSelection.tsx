import { useSelector } from "react-redux";
import Filter from "../../../filter/Filter";
import LoadingOverlay from "../../../loading/LoadingOverlay";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../../ui/table";

import { AppDispatch, RootState } from "../../../../store/store";
import { useEffect, useRef, useState } from "react";
import { debouncer } from "../../../../utils/debouncer";
import { useFilteredData } from "../../../../hooks/useFilteredData";
import { LandTypes, searchLand } from "../../../../store/slices/landSlice";

interface LandSelectionProp {
  selectedLand: LandTypes | null;
  setSelectedLand: (value: React.SetStateAction<LandTypes | null>) => void;

  dispatch: AppDispatch;
}

const LandSelection = ({
  selectedLand,
  setSelectedLand,
  dispatch,
}: LandSelectionProp) => {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [searchLoading, setSearchLoading] = useState(false);

  const { byId, allIds, filterById, filterLoading, filterIds, loading } =
    useSelector((state: RootState) => state.land);

  const debouncedSearchRef = useRef<ReturnType<typeof debouncer> | null>(null);

  if (!debouncedSearchRef.current) {
    debouncedSearchRef.current = debouncer(async (landName: string) => {
      try {
        console.log("searching land: ", landName);
        await dispatch(searchLand(landName));
      } catch (error) {
        console.log("onSearchFilter error: ", error);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  }

  useEffect(() => {
    if (search?.trim()) {
      setSearchLoading(true);
      debouncedSearchRef.current!(search);
    }
  }, [search]);

  const displayData = useFilteredData<LandTypes>({
    originalData: { byId, allIds },
    filteredData: { byId: filterById, allIds: filterIds },
    filterOptions: {
      searchInput: search,
    },
  });

  return (
    <>
      <Filter
        onSearchChange={setSearch}
        SearchPlaceholder="Search land by name or location..."
      />

      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {(filterLoading || searchLoading || loading) && (
          <LoadingOverlay message="Loading lands..." />
        )}

        <div className="h-80 overflow-y-auto custom-scrollbar">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-3 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400 sm:text-theme-xs"
                >
                  Land Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400 sm:text-theme-xs"
                >
                  Location
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400 sm:text-theme-xs"
                >
                  Select
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {displayData.allIds.length > 0 ? (
                displayData.allIds.map((id: string | number) => {
                  const land: LandTypes = displayData.byId[id];

                  return (
                    <TableRow
                      key={land._id}
                      className={`transition-colors cursor-pointer ${
                        selectedLand?._id === land._id
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <TableCell className="px-3 py-4 text-start">
                        <span className="block font-medium text-gray-800 text-sm dark:text-white/90">
                          {land.name || "N/A"}
                        </span>
                      </TableCell>

                      <TableCell className="px-3 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                        {land.location || "N/A"}
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <input
                          type="radio"
                          checked={selectedLand?._id === land._id}
                          onChange={() => setSelectedLand(land)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">
                    No lands found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default LandSelection;
