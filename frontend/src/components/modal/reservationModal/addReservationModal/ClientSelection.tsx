import { useEffect, useRef, useState } from "react";
import Filter from "../../../filter/Filter";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../../ui/table";

import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { debouncer } from "../../../../utils/debouncer";
import LoadingOverlay from "../../../loading/LoadingOverlay";
import { useFilteredData } from "../../../../hooks/useFilteredData";
import {
  ClientType,
  resetClientFilter,
  searchClient,
} from "../../../../store/slices/clientSlice";

interface ClientSelectorProp {
  selectedClient: ClientType | null;
  getFullName: (client: ClientType) => string;
  setSelectedClient: React.Dispatch<React.SetStateAction<ClientType | null>>;
  dispatch: AppDispatch;
}

const ClientSelector = ({
  selectedClient,
  getFullName,
  setSelectedClient,
  dispatch,
}: ClientSelectorProp) => {
  const { byId, allIds, filterIds, filterById, filterLoading } = useSelector(
    (state: RootState) => state.client
  );

  const [search, setSeach] = useState<string | undefined>(undefined);
  const [onSearchLoading, setOnSearchLoading] = useState(false);
  const debouncedSearchRef = useRef<ReturnType<typeof debouncer> | null>(null);

  if (!debouncedSearchRef.current) {
    debouncedSearchRef.current = debouncer(async (clientName: string) => {
      try {
        await dispatch(searchClient({ query: clientName }));
      } catch (error) {
        console.log("Failed on filtering client ", error);
      } finally {
        setOnSearchLoading(false);
      }
    }, 400);
  }

  useEffect(() => {
    if (search && search.trim()) {
      setOnSearchLoading(true);
      debouncedSearchRef.current!(search);
    } else {
      dispatch(resetClientFilter());
    }
  }, [search]);

  const displayData = useFilteredData<ClientType>({
    originalData: { byId, allIds },
    filteredData: { byId: filterById, allIds: filterIds },
    filterOptions: {
      searchInput: search,
      filterLoading: filterLoading || onSearchLoading,
    },
  });

  return (
    <>
      <Filter
        onSearchChange={setSeach}
        SearchPlaceholder="Search client by name or contact..."
      />

      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {(onSearchLoading || filterLoading) && (
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
                  Full Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400 sm:text-theme-xs"
                >
                  Contact
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
                displayData.allIds.map((id) => {
                  const client: ClientType = displayData.byId[id];
                  return (
                    <TableRow
                      key={client._id}
                      className={`transition-colors cursor-pointer ${
                        selectedClient?._id === client._id
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <TableCell className="px-3 py-4 text-start">
                        <span className="block font-medium text-gray-800 text-sm dark:text-white/90">
                          {getFullName(client)}
                        </span>
                      </TableCell>

                      <TableCell className="px-3 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                        {client.contact || "N/A"}
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <input
                          type="radio"
                          checked={selectedClient?._id === client._id || false}
                          onChange={() => setSelectedClient(client)}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">
                    No clients found.
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

export default ClientSelector;
