import { DeleteIcon, EditIcon } from "../../../icons";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Filter from "../../filter/Filter";
import { LandTypes } from "../../../store/slices/landSlice";
import LoadingOverlay from "../../loading/LoadingOverlay";
import TableRowSkeleton from "../../loading/TableRowSkeleton";

interface LandTableProp {
  openConfirmationModal: () => void;
  loading: boolean;
  isFiltering: boolean;
  allIds: string[];
  byId: { [key: string]: LandTypes };
  setDeleteData: (data: LandTypes) => void;
  setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
  editLand: (data: LandTypes) => void;
  openLandModal: () => void;
}

export default function LandTable({
  openConfirmationModal,
  isFiltering,
  loading,
  setDeleteData,
  allIds,
  byId,
  setSearch,
  editLand,
  openLandModal,
}: LandTableProp) {
  const deleteHanlder = (data: LandTypes) => {
    setDeleteData(data);
    openConfirmationModal();
  };

  const openEditModal = (land: LandTypes) => {
    editLand(land);
    openLandModal();
  };

  return (
    <>
      <Filter onSearchChange={setSearch} />
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {isFiltering && <LoadingOverlay message="Filtering results..." />}

        <div className="relative overflow-hidden">
          {/* Fixed height container for the table body */}
          <div className="h-[500px] overflow-auto custom-scrollbar">
            <Table className="min-w-full border-collapse">
              {/* Sticky Table Header */}
              <TableHeader className="sticky top-0 z-10 border-b border-gray-100 bg-white dark:border-white/[0.05] dark:bg-gray-900">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap"
                  >
                    Project Name
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Total Area (sqm)</span>
                    <span className="sm:hidden">Area</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Total Lots</span>
                    <span className="sm:hidden">Total</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Available Lots</span>
                    <span className="sm:hidden">Available</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Lots Sold</span>
                    <span className="sm:hidden">Sold</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap sticky right-0 bg-white dark:bg-gray-900"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body with fixed height container */}
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
                  allIds.map((id, index) => {
                    const land: LandTypes = byId[id];

                    return (
                      <TableRow
                        key={id}
                        className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="px-3 py-4 sm:px-5 text-start dark:text-gray-50">
                          <div
                            className="font-medium truncate max-w-[150px] sm:max-w-none"
                            title={land.name}
                          >
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {land.name}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {land.location}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400 whitespace-nowrap">
                          <span className="hidden sm:inline">
                            {land.totalArea} Sqm
                          </span>
                          <span className="sm:hidden">{land.totalArea}</span>
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                          {land.totalLots}
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                          {land.available}
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                          {land.lotsSold}
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400 sticky right-0 bg-white dark:bg-gray-900 min-w-[80px]">
                          <div className="flex gap-1 sm:gap-2">
                            <EditIcon
                              className="w-4 h-4 sm:w-5 sm:h-5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              onClick={() => openEditModal(land)}
                            />
                            <DeleteIcon
                              className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 cursor-pointer hover:text-red-700 dark:hover:text-red-400 transition-colors"
                              onClick={() => deleteHanlder(land)}
                            />
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
