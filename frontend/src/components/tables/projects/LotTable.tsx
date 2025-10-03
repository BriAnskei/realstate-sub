import { DeleteIcon, EditIcon } from "../../../icons";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Filter from "../../filter/Filter";
import { deleteLot, LotType, updateLot } from "../../../store/slices/lotSlice";
import { useState } from "react";
import Badge from "../../ui/badge/Badge";
import ConfirmtionModal from "../../modal/ConfirmtionModal";
import { AppDispatch, RootState } from "../../../store/store";
import LotFormModal from "../../modal/projects-modals/LotFormModal";
import useLotModal from "../../../hooks/projects-hooks/modal/useLotModal";
import LoadingOverlay from "../../loading/LoadingOverlay";
import TableRowSkeleton from "../../loading/TableRowSkeleton";
import { useDispatch, useSelector } from "react-redux";

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
  isEmployee?: boolean;
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
  isEmployee = false,
  updateLoading,
  closeConfirmationModal,
  setFilterStatus,
  setSeachInput,
}: LotTableProp) {
  const [deleteData, setDeleteData] = useState<LotType | undefined>();

  const { isLotModalOpen, editData, closeLotModal, editLot } = useLotModal();

  const onDeleteHandler = (data: LotType) => {
    setDeleteData(data);
    openConfirmationModal();
  };

  const handleDelete = async () => {
    await dispatch(deleteLot(deleteData!));
  };

  const handleSaveUpdate = async (lot: LotType) => {
    await dispatch(updateLot({ id: lot._id, newData: lot }));
  };

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

      {/* Main container with proper responsive handling */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {isFiltering && <LoadingOverlay message="Filtering results..." />}

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
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-[120px]"
                  >
                    Land Name
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-[80px]"
                  >
                    <span className="hidden sm:inline">Block No.</span>
                    <span className="sm:hidden">Block</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-[70px]"
                  >
                    <span className="hidden sm:inline">Lot No.</span>
                    <span className="sm:hidden">Lot</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-[90px]"
                  >
                    <span className="hidden sm:inline">Lot Size (sqm)</span>
                    <span className="sm:hidden">Size</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-[100px]"
                  >
                    <span className="hidden sm:inline">Price per sqm</span>
                    <span className="sm:hidden">Price</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-[110px]"
                  >
                    <span className="hidden sm:inline">Total Amount</span>
                    <span className="sm:hidden">Amount</span>
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-[80px]"
                  >
                    Status
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-[80px]"
                  >
                    <span className="hidden sm:inline">Lot Type</span>
                    <span className="sm:hidden">Type</span>
                  </TableCell>

                  {isEmployee && (
                    <TableCell
                      isHeader
                      className="px-3 py-3 font-medium text-gray-500 text-start text-xs sm:px-5 sm:text-theme-xs dark:text-gray-400 whitespace-nowrap min-w-[80px]"
                    >
                      Actions
                    </TableCell>
                  )}
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {isLoading ? (
                  <RenderSkeletonLoading />
                ) : (
                  allIds.map((id) => {
                    const lot: LotType = byId[id];

                    return (
                      <LotTableRow
                        key={id}
                        lot={lot}
                        isEmployee={isEmployee}
                        editLot={editLot}
                        onDeleteHandler={onDeleteHandler}
                      />
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <LotFormModal
        isLoading={updateLoading}
        isOpen={isLotModalOpen}
        onClose={closeLotModal}
        data={editData}
        saveUpdate={handleSaveUpdate}
      />

      <ConfirmtionModal
        title="Delete Lot"
        message="Are you sure you want to delete this? Once deleted, the data will be permanently removed and cannot be recovered."
        loading={updateLoading}
        isOpen={isConfirmationOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleDelete}
      />
    </>
  );
}

function RenderSkeletonLoading() {
  return (
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
  );
}

function LotTableRow(payload: {
  lot: LotType;
  isEmployee: boolean;
  editLot: (data: LotType) => void;
  onDeleteHandler: (data: LotType) => void;
}) {
  const { lot, isEmployee, editLot, onDeleteHandler } = payload;
  return (
    <>
      <TableRow className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
        <TableCell className="px-3 py-4 sm:px-5 text-start dark:text-gray-50 min-w-[120px]">
          <div className="font-medium truncate max-w-[150px]" title={lot.name}>
            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
              {lot.name}
            </span>
            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
              {lot.lotType}
            </span>
          </div>
        </TableCell>

        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400 min-w-[80px]">
          {lot.blockNumber}
        </TableCell>

        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400 min-w-[70px]">
          {lot.lotNumber}
        </TableCell>

        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400 whitespace-nowrap min-w-[90px]">
          <span className="hidden sm:inline">{lot.lotSize} Sqm</span>
          <span className="sm:hidden">{lot.lotSize}</span>
        </TableCell>

        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400 min-w-[100px]">
          <span className="truncate" title={lot.pricePerSqm?.toString()}>
            {lot.pricePerSqm}
          </span>
        </TableCell>

        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400 min-w-[110px]">
          <div
            className="truncate max-w-[100px]"
            title={lot.totalAmount?.toString()}
          >
            {lot.totalAmount?.toLocaleString()}
          </div>
        </TableCell>

        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400 min-w-[80px]">
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
            {lot.status?.charAt(0).toUpperCase()! + lot.status?.slice(1)}
          </Badge>
        </TableCell>

        <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400 min-w-[70px]">
          {lot.lotType}
        </TableCell>

        {isEmployee && (
          <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400 min-w-[70px]">
            <div className="flex gap-1 sm:gap-2 justify-center">
              <EditIcon
                className="dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => editLot(lot)}
              />
              <DeleteIcon
                className="text-red-600 cursor-pointer hover:text-red-700 dark:hover:text-red-400 transition-colors"
                onClick={() => onDeleteHandler(lot)}
              />
            </div>
          </TableCell>
        )}
      </TableRow>
    </>
  );
}
