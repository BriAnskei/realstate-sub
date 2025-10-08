import { useEffect, useState } from "react";
import Filter from "../../../filter/Filter";
import Checkbox from "../../../form/input/Checkbox";
import LoadingOverlay from "../../../loading/LoadingOverlay";
import Button from "../../../ui/button/Button";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../../ui/table";
import { LandTypes, LotType } from "./ReservationModal";
import { AppDispatch, RootState } from "../../../../store/store";
import { useSelector } from "react-redux";
import { getLotsByLandId } from "../../../../store/slices/lotSlice";

interface LotSelectionProp {
  selectedLand: LandTypes | null;
  setCurrentStep: React.Dispatch<
    React.SetStateAction<"client" | "lot" | "land" | "details">
  >;
  setSelectedLots: React.Dispatch<React.SetStateAction<LotType[]>>;

  selectedLots: LotType[];

  dispatch: AppDispatch;
}

const LotSelection = ({
  selectedLand,
  setCurrentStep,
  setSelectedLots,

  selectedLots,

  dispatch,
}: LotSelectionProp) => {
  const { filterById, allFilterIds, filterLoading } = useSelector(
    (state: RootState) => state.lot
  );

  const toggleLotSelection = (lot: LotType) => {
    setSelectedLots((prev) => {
      if (prev.find((l) => l._id === lot._id)) {
        return prev.filter((l) => l._id !== lot._id);
      } else {
        return [...prev, lot];
      }
    });
  };

  useEffect(() => {
    const fetchLotsByLand = async () => {
      try {
        const landId = selectedLand?._id;
        if (!landId) return;
        await dispatch(getLotsByLandId(landId)).unwrap();
      } catch (error) {
        console.log("Erro in fetchLotsByLand", error);
      }
    };
    fetchLotsByLand();
  }, [selectedLand]);

  return (
    <>
      <div className="mb-4 px-2">
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              Selected Land: {selectedLand?.name}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {selectedLand?.location}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setCurrentStep("land");
              setSelectedLots([]);
            }}
          >
            Change
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {filterLoading && <LoadingOverlay message="Loading lots..." />}
        <div className="h-80 overflow-y-auto custom-scrollbar">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-3 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400 sm:text-theme-xs"
                >
                  Block Number
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400 sm:text-theme-xs"
                >
                  Lot Number
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
              {allFilterIds.length > 0 ? (
                allFilterIds.map((id) => {
                  const lot: LotType = filterById[id];
                  return (
                    <TableRow
                      key={lot._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <TableCell className="px-3 py-4 text-start">
                        <span className="block font-medium text-gray-800 text-sm dark:text-white/90">
                          {lot.blockNumber || "N/A"}
                        </span>
                      </TableCell>

                      <TableCell className="px-3 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                        {lot.lotNumber || "N/A"}
                      </TableCell>

                      <TableCell className="px-3 py-3">
                        <Checkbox
                          checked={
                            !!selectedLots.find((l) => l._id === lot._id)
                          }
                          onChange={() => toggleLotSelection(lot)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">
                    {selectedLand
                      ? "No available lots found for this land."
                      : "Please select a land first."}
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

export default LotSelection;
