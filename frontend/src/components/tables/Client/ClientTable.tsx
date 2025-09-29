import { DeleteIcon, EditIcon, ViewIcon } from "../../../icons";
import { ClientType } from "../../../store/slices/clientSlice";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Filter from "../../filter/Filter";
import Badge from "../../ui/badge/Badge";
import { renderImageOrDefault } from "../../../utils/api/ImageApiHelper";
import TableRowSkeleton from "../../loading/TableRowSkeleton";
import LoadingOverlay from "../../loading/LoadingOverlay";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useFilteredData } from "../../../hooks/useFilteredData";

interface ClientTableProp {
  openConfirmationModal: () => void;
  editClient: (data: ClientType) => void;
  setDeleteData: (data: ClientType) => void;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFilterStatus?: React.Dispatch<React.SetStateAction<string | undefined>>;
  search: string | undefined;
  searchLoading: boolean;
  isLoading: boolean;
  filterLoading: boolean;
  status?: string;
  openClientInfoModal: (clientData: ClientType) => void;
  isEmployee?: boolean;
}

export default function ClientTable({
  search,
  searchLoading,
  status,
  openConfirmationModal,
  editClient,
  setDeleteData,
  setSearch,
  setFilterStatus,
  openClientInfoModal,
  isEmployee = false,
}: ClientTableProp) {
  const { allIds, byId, filterLoading, filterById, filterIds, loading } =
    useSelector((state: RootState) => state.client);

  const getData = useFilteredData({
    originalData: { byId, allIds },
    filteredData: { byId: filterById, allIds: filterIds },
    filterOptions: {
      searchInput: search,
      filterStatus: status,
      filterLoading: filterLoading || searchLoading,
    },
  });

  const deleteHandler = (data: ClientType) => {
    setDeleteData(data);
    openConfirmationModal();
  };

  const resetFilter = () => {
    setSearch(undefined);
  };

  return (
    <>
      <Filter
        SearchPlaceholder="Search By Client"
        sortTitle="All"
        onSearchChange={setSearch}
        onSortChange={setFilterStatus}
        sortOptions={[
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ]}
        onClearFilters={resetFilter}
      />

      {/* Main container with proper responsive handling */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {(filterLoading || searchLoading) && (
          <LoadingOverlay message="Filtering results..." />
        )}

        {/* Horizontal scroll container */}
        <div className="overflow-x-auto">
          {/* Vertical scroll container with fixed height */}
          <div className="h-[500px] overflow-y-auto custom-scrollbar">
            <Table className="w-full border-collapse">
              {/* Sticky Table Header */}
              <TableHeader className="sticky top-0 z-10 border-b border-gray-100 bg-white dark:border-white/[0.05] dark:bg-gray-900">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-[200px]"
                  >
                    Name
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-[120px]"
                  >
                    Contact
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-[120px]"
                  >
                    <span className="hidden sm:inline">Marital Status</span>
                    <span className="sm:hidden">Status</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-[150px]"
                  >
                    Address
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-[100px]"
                  >
                    Status
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-[100px]"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <>
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                    <TableRowSkeleton />
                  </>
                ) : (
                  getData.allIds.map((id) => {
                    const client: ClientType = getData.byId[id];

                    return (
                      <TableRow
                        key={id}
                        className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="px-3 py-4 sm:px-5 text-start dark:text-gray-50 min-w-[200px]">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 overflow-hidden rounded-full flex-shrink-0">
                              <img
                                className="w-full h-full object-cover"
                                src={renderImageOrDefault(
                                  client._id,
                                  client.profilePicc as string
                                )}
                                alt="Profile"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className="font-medium truncate max-w-[150px] sm:max-w-[200px]"
                                title={`${client.firstName} ${client.middleName} ${client.lastName}`}
                              >
                                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                  {`${client.firstName} ${client.middleName} ${client.lastName}`}
                                </span>
                                <span
                                  className="block text-gray-500 text-theme-xs dark:text-gray-400 truncate"
                                  title={client.email}
                                >
                                  {client.email}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400 min-w-[120px]">
                          <span
                            className="truncate block max-w-[100px]"
                            title={client.contact}
                          >
                            {client.contact}
                          </span>
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400 min-w-[120px]">
                          <span
                            className="truncate block max-w-[100px]"
                            title={client.Marital}
                          >
                            {client.Marital}
                          </span>
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400 min-w-[150px]">
                          <div
                            className="truncate max-w-[120px] sm:max-w-[150px]"
                            title={client.address}
                          >
                            {client.address}
                          </div>
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400 min-w-[100px]">
                          <Badge
                            size="sm"
                            color={
                              client.status === "active" ? "success" : "error"
                            }
                          >
                            {client.status?.charAt(0).toUpperCase()! +
                              client.status?.slice(1)!}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex gap-1 sm:gap-2 justify-center">
                            <ViewIcon
                              className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              onClick={() => openClientInfoModal(client)}
                            />
                            <EditIcon
                              className="w-3.5 h-3.5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              onClick={() => editClient(client)}
                            />
                            {isEmployee && (
                              <DeleteIcon
                                className="w-3.5 h-3.5 text-red-600 cursor-pointer hover:text-red-700 dark:hover:text-red-400 transition-colors"
                                onClick={() => deleteHandler(client)}
                              />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
