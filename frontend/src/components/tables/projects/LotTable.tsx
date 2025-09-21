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
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { LotType } from "../../../store/slices/lotSlice";

interface LandTableProp {
  openConfirmationModal: () => void;

  allIds: string[];
  byId: { [key: string]: LandTypes };
  setDeleteData: (data: LandTypes) => void;
}

export default function LotTable({
  openConfirmationModal,

  setDeleteData,
  allIds,
  byId,
}: LandTableProp) {
  const deleteHanlder = (data: LandTypes) => {
    setDeleteData(data);
    openConfirmationModal();
  };

  return (
    <>
      <Filter
        SearchPlaceholder="Search By Land"
        sortTitle="All"
        sortOptions={[
          { label: "Available", value: "0" },
          { label: "Occupied", value: "0" },
          { label: "Reserve", value: "0" },
        ]}
      />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
              {allIds.map((id, index) => {
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
                      {lot.lotStatus}
                    </TableCell>
                    <TableCell className="px-4 py-3 ">
                      <div className="flex  gap-2">
                        <EditIcon className="dark:text-gray-400 cursor-pointer" />
                        <DeleteIcon className="text-red-600 cursor-pointer" />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
