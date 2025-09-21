import { useState } from "react";
import { DeleteIcon } from "../../../icons";
import { LotType } from "../../../store/slices/lotSlice";
import ComponentCard from "../../common/ComponentCard";
import LotSelectionModal from "../../modal/saleModal/LotSelectionModal";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../ui/table";

interface LotTableProp {
  lots: LotType[];

  setSelectedLots: React.Dispatch<React.SetStateAction<LotType[]>>;
}

export function SaleLotTable({ setSelectedLots, lots }: LotTableProp) {
  const [isLotModalOpen, setIsLotModalOpen] = useState(false);
  const deleteHanlder = (lotId: string) => {
    setSelectedLots((prev) => {
      return prev.filter((lot) => {
        lot._id !== lotId;
      });
    });
  };

  return (
    <>
      <ComponentCard
        title="Selected  Lots"
        className="mb-7"
        actions={[
          <button
            key="add"
            className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm  text-white  bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
            onClick={() => setIsLotModalOpen(true)}
          >
            Select Lots
          </button>,
        ]}
      >
        <div className=" overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Name
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Contact
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Address
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Total Amount
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Price Per Sqm
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
                    Deletion
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {lots.map((lot, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {lot.blockNumber}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {lot.lotNumber}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {lot.lotSize} Sqm
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {lot.pricePerSqm}
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {lot.totalAmount}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {lot.lotType}
                      </TableCell>

                      <TableCell className="px-4 py-3 ">
                        <div className="flex  gap-2">
                          <DeleteIcon
                            className="text-red-600 cursor-pointer"
                            onClick={() => deleteHanlder(lot._id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </ComponentCard>
      <LotSelectionModal
        isOpen={isLotModalOpen}
        onClose={() => setIsLotModalOpen(false)}
        selectedData={setSelectedLots}
      />
    </>
  );
}
