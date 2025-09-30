import { useState, useMemo, useEffect } from "react";
import Checkbox from "../../form/input/Checkbox";
import Button from "../../ui/button/Button";
import { Modal } from "../../ui/modal";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../ui/table";
import Filter from "../../filter/Filter";
import { LotType } from "../../../store/slices/lotSlice"; // ✅ import your lot type

interface LotFormModalProp {
  lotById: { [key: string]: LotType };
  lotIds: string[];
  isOpen: boolean;
  landId?: string;
  onClose: () => void;
  selectedData: (data: LotType[]) => void; // ✅ multiple lots
}

const LotSelectionModal = ({
  lotById,
  lotIds,
  isOpen,
  landId,
  onClose,
  selectedData,
}: LotFormModalProp) => {
  const [selectedLots, setSelectedLots] = useState<LotType[]>([]);

  useEffect(() => {
    // reset the selected lots if landId changes
    if (
      landId &&
      selectedLots.length > 0 &&
      selectedLots[0].landId !== landId
    ) {
      setSelectedLots([]);
    }
  }, [landId, selectedLots]);

  const saveHandler = () => {
    if (selectedLots.length === 0) return;
    selectedData(selectedLots);
    onClose();
  };

  // ✅ Handle checkbox (multi-select)
  const toggleSelection = (lot: LotType) => {
    setSelectedLots((prev) => {
      if (prev.find((l) => l._id === lot._id)) {
        return prev.filter((l) => l._id !== lot._id); // remove
      } else {
        return [...prev, lot]; // add
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <div>
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-3">
              Select Lots
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 lg:mb-7">
              Choose multiple lots to include in this sale transaction.
            </p>
          </div>
        </div>

        {/* <Filter
          onSearchChange={setSearchQuery}
          SearchPlaceholder="Search lot..."
          onSortChange={setSortBy}
        /> */}

        {/* Fixed height table container */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="h-80 overflow-y-auto custom-scrollbar">
            <Table className="min-w-full">
              <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[100px]"
                  >
                    Block / Lot
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[80px]"
                  >
                    Size
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[100px]"
                  >
                    Price/Sqm
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[80px]"
                  >
                    Select
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {lotIds.length > 0 ? (
                  lotIds.map((id) => {
                    const lot: LotType = lotById[id];
                    return (
                      <TableRow
                        key={lot._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        {/* Block / Lot */}
                        <TableCell className="px-3 py-4 text-start min-w-[100px]">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              Block {lot.blockNumber} - Lot {lot.lotNumber}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {lot.lotType}
                            </span>
                          </div>
                        </TableCell>

                        {/* Size */}
                        <TableCell className="px-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[80px]">
                          {lot.lotSize} sqm
                        </TableCell>

                        {/* Price/Sqm */}
                        <TableCell className="px-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[100px]">
                          ₱{lot.pricePerSqm}
                        </TableCell>

                        {/* Checkbox */}
                        <TableCell className="px-3 py-3 min-w-[80px]">
                          <Checkbox
                            checked={
                              !!selectedLots.find((l) => l._id === lot._id)
                            }
                            onChange={() => toggleSelection(lot)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">
                      No lots found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" type="submit" onClick={saveHandler}>
            Save({selectedLots.length})
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LotSelectionModal;
