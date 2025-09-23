import { DeleteIcon, EditIcon } from "../../../icons";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Filter from "../../filter/Filter";
import { deleteLot, LotType } from "../../../store/slices/lotSlice";
import { useEffect, useState } from "react";
import Badge from "../../ui/badge/Badge";
import ConfirmtionModal from "../../modal/ConfirmtionModal";
import { AppDispatch } from "../../../store/store";
import LotFormModal from "../../modal/projects-modals/LotFormModal";
import useLotModal from "../../../hooks/projects-hooks/modal/useLotModal";
import LoadingOverlay from "../../loading/LoadingOverlay";
import TableRowSkeleton from "../../loading/TableRowSkeleton";

interface LotTableProp {
  dispatch: AppDispatch;
  setSeachInput: React.Dispatch<React.SetStateAction<string | undefined>>;
  setFilterStatus: React.Dispatch<React.SetStateAction<string | undefined>>;
  openConfirmationModal: () => void;
  closeConfirmationModal: () => void;
  allIds: string[];
  byId: { [key: string]: LotType };
  isConfirmationOpen: boolean;
  isLoading?: boolean;
  isFiltering?: boolean;
  updateLoading: boolean;
}

export default function LotTable({
  dispatch,
  openConfirmationModal,
  isConfirmationOpen,
  allIds,
  byId,
  isLoading,
  isFiltering = false,
  updateLoading,
  closeConfirmationModal,
  setFilterStatus,
  setSeachInput,
}: LotTableProp) {
  const [deleteId, setDeleteId] = useState<string | undefined>();

  const { isLotModalOpen, editData, closeLotModal, editLot } = useLotModal();

  const onDeleteHandler = (data: LotType) => {
    setDeleteId(data._id);
    openConfirmationModal();
  };

  const handleDelete = async () => {
    await dispatch(deleteLot(deleteId!));
  };

  const handleSaveUpdate = async (lot: LotType) => {};

  return (
    <>
      <Filter
        SearchPlaceholder="Search By Land"
        sortTitle="All"
        onSearchChange={setSeachInput}
        onSortChange={setFilterStatus}
        sortOptions={[
          { label: "Available", value: "available" },
          { label: "Reserved", value: "reserved" },
          { label: "Sold", value: "sold" },
        ]}
      />

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
                    Land Name
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Block No.</span>
                    <span className="sm:hidden">Block</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Lot No.</span>
                    <span className="sm:hidden">Lot</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Lot Size (sqm)</span>
                    <span className="sm:hidden">Size</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Price per sqm</span>
                    <span className="sm:hidden">Price</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Lot Type</span>
                    <span className="sm:hidden">Type</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap"
                  >
                    Status
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
                {isLoading ? (
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
                    const lot: LotType = byId[id];

                    return (
                      <TableRow
                        key={id}
                        className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="px-3 py-4 sm:px-5 text-start dark:text-gray-50">
                          <div
                            className="font-medium truncate max-w-[150px] sm:max-w-none"
                            title={lot.name}
                          >
                            {lot.name}
                          </div>
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                          {lot.blockNumber}
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                          {lot.lotNumber}
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400 whitespace-nowrap">
                          <span className="hidden sm:inline">
                            {lot.lotSize} Sqm
                          </span>
                          <span className="sm:hidden">{lot.lotSize}</span>
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                          {lot.pricePerSqm}
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                          <div
                            className="truncate max-w-[100px] sm:max-w-none"
                            title={lot.lotType}
                          >
                            {lot.lotType}
                          </div>
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                          <Badge
                            size="sm"
                            color={
                              lot.status === "available"
                                ? "success"
                                : lot.status === "reserved"
                                ? "warning"
                                : "error"
                            }
                          >
                            {lot.status?.charAt(0).toLocaleUpperCase()! +
                              lot.status?.slice(1)!}
                          </Badge>
                        </TableCell>

                        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                          <div className="flex gap-1 sm:gap-2">
                            <EditIcon
                              className="w-4 h-4 sm:w-5 sm:h-5 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              onClick={() => editLot(lot)}
                            />
                            <DeleteIcon
                              className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 cursor-pointer hover:text-red-700 dark:hover:text-red-400 transition-colors"
                              onClick={() => onDeleteHandler(lot)}
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

      <LotFormModal
        isOpen={isLotModalOpen}
        onClose={closeLotModal}
        data={editData}
        saveUpdate={handleSaveUpdate}
      />

      {/* delete confirmation */}
      <ConfirmtionModal
        title="Delete Lot"
        message="Are you sure you want to delete this? Once deleted, all the transactions data will be lost."
        loading={updateLoading}
        isOpen={isConfirmationOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleDelete}
      />
    </>
  );
}
