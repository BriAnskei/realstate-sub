import { useState, useMemo, useEffect } from "react";
import { LandTypes } from "../../../store/slices/landSlice";
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
import LoadingOverlay from "../../loading/LoadingOverlay";

interface ClientFormModalProp {
  byId: { [key: string]: LandTypes };
  allIds: string[];
  filterLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  selectedData: (data: LandTypes) => void;
  setSearchQuery: React.Dispatch<React.SetStateAction<string | undefined>>;

  selectedLandData?: LandTypes;
  // this prop will only be field if appliction is updating
}

const LandSelectionModal = ({
  isOpen,
  byId,
  allIds,
  filterLoading,
  setSearchQuery,
  onClose,
  selectedData,
  selectedLandData,
}: ClientFormModalProp) => {
  const [selectedLand, setSelectedLand] = useState<LandTypes>();

  useEffect(() => {
    if (selectedLandData) {
      setSelectedLand(selectedLandData);
    }
  }, [selectedLandData]);

  // ✅ Handle checkbox
  const toggleSelection = (data: LandTypes) => {
    setSelectedLand((prev) => {
      if (!prev) {
        return data;
      } else if (prev && prev._id !== data._id) {
        return data;
      } else if (prev && prev._id === data._id) {
        return prev;
      }
    });
  };

  const handleSave = () => {
    if (selectedLand) {
      selectedData(selectedLand);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Select Land
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Please choose a land property to associate with this sale
            transaction.
          </p>
        </div>

        <Filter
          onSearchChange={setSearchQuery}
          SearchPlaceholder="Search land..."
        />

        {/* Fixed height table container with relative positioning */}
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          {filterLoading && <LoadingOverlay message="Filtering results..." />}
          <div className="h-80 overflow-y-auto custom-scrollbar">
            <Table className="min-w-full">
              <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 bg-white dark:bg-gray-900 min-w-[200px]"
                  >
                    Land Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 bg-white dark:bg-gray-900 min-w-[100px]"
                  >
                    Total Area
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 bg-white dark:bg-gray-900 min-w-[120px]"
                  >
                    Available Lots
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 bg-white dark:bg-gray-900 min-w-[80px]"
                  >
                    Select
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {allIds.length > 0 ? (
                  allIds.map((id) => {
                    const land: LandTypes = byId[id];
                    return (
                      <TableRow
                        key={land._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        {/* Land Name + Location */}
                        <TableCell className="px-3 py-4 text-start min-w-[200px]">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {land.name}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {land.location}
                            </span>
                          </div>
                        </TableCell>

                        {/* Total Area */}
                        <TableCell className="px-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[100px]">
                          {land.totalArea?.toLocaleString()} sqm
                        </TableCell>

                        {/* Available Lots */}
                        <TableCell className="px-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[120px]">
                          {land.available}
                        </TableCell>

                        {/* Checkbox */}
                        <TableCell className="px-3 py-3 min-w-[80px]">
                          <Checkbox
                            checked={land._id === selectedLand?._id}
                            onChange={() => toggleSelection(land)}
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

        {/* Actions */}
        <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
          <Button size="sm" variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" type="submit" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default LandSelectionModal;
