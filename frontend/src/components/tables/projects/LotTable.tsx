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

// Loading skeleton component for table rows
const TableRowSkeleton = () => (
  <TableRow>
    {Array.from({ length: 8 }).map((_, index) => (
      <TableCell key={index} className="px-4 py-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </TableCell>
    ))}
  </TableRow>
);

// Loading overlay component
const LoadingOverlay = ({ message = "Loading..." }: { message?: string }) => (
  <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10">
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-gray-700 dark:text-gray-300 font-medium">
        {message}
      </span>
    </div>
  </div>
);

interface LotTableProp {
  openConfirmationModal: () => void;
  closeConfirmationModal: () => void;
  allIds: string[];
  byId: { [key: string]: LotType };
  isConfirmationOpen: boolean;
  isLoading?: boolean;
  isFiltering?: boolean;
  updateLoading: boolean;
  setSeachInput: React.Dispatch<React.SetStateAction<string | undefined>>;
  dispatch: AppDispatch;
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
  setSeachInput,
}: LotTableProp) {
  const [deleteId, setDeleteId] = useState<string | undefined>();

  const onDeleteHandler = (data: LotType) => {
    setDeleteId(data._id);
    openConfirmationModal();
  };

  const handleDelete = async () => {
    await dispatch(deleteLot(deleteId!));
  };

  return (
    <>
      <Filter
        SearchPlaceholder="Search By Land"
        sortTitle="All"
        onSearchChange={setSeachInput}
        sortOptions={[
          { label: "Available", value: "0" },
          { label: "Occupied", value: "0" },
          { label: "Reserve", value: "0" },
        ]}
      />

      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {isFiltering && <LoadingOverlay message="Filtering results..." />}

        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Land Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Block No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Lot No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Lot Size (sqm)
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Price per sqm
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Lot Type
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {isLoading ? (
                // Show skeleton rows when loading
                <>
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                  <TableRowSkeleton />
                </>
              ) : (
                // Show actual data
                allIds.map((id, index) => {
                  const lot: LotType = byId[id];

                  return (
                    <TableRow key={index}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start dark:text-gray-50">
                        {lot.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {lot.blockNumber}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {lot.lotNumber}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {lot.lotSize}Sqm
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {lot.pricePerSqm}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {lot.lotType}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
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
                      <TableCell className="px-4 py-3">
                        <div className="flex gap-2">
                          <EditIcon className="dark:text-gray-400 cursor-pointer" />
                          <DeleteIcon
                            className="text-red-600 cursor-pointer"
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
