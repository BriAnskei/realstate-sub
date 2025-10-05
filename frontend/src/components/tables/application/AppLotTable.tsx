import { useEffect, useState } from "react";
import { DeleteIcon } from "../../../icons";
import {
  getLotsByIds,
  getLotsByLandId,
  LotType,
} from "../../../store/slices/lotSlice";
import ComponentCard from "../../common/ComponentCard";
import LotSelectionModal from "../../modal/saleModal/LotSelectionModal";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../ui/table";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { ApplicationType } from "../../../store/slices/applicationSlice";

interface AppLotTableProp {
  setApplication: React.Dispatch<React.SetStateAction<ApplicationType>>;
  landId?: string;

  selectedLotsId?: number[]; // contained the selected lots if we are eding applicaiton
}

export function AppLotTable({
  setApplication,
  landId,
  selectedLotsId,
}: AppLotTableProp) {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedLots, setSelectedLots] = useState<LotType[] | undefined>(
    undefined
  );
  const { filterById, allFilterIds } = useSelector(
    (state: RootState) => state.lot
  );

  const [isLotModalOpen, setIsLotModalOpen] = useState(false);

  useEffect(() => {
    const fetchLotsByLand = async () => {
      try {
        if (!landId) return;
        // reset the state first
        setApplication((prev) => ({
          ...prev,
          lotIds: undefined,
        }));

        await dispatch(getLotsByLandId(landId));
      } catch (error) {
        console.log("Failt to fetch lots:", error);
      }
    };
    fetchLotsByLand();
  }, [landId]);

  useEffect(() => {
    async function fetchSelectedLots() {
      try {
        if (!selectedLotsId) return;
        const fetchedLotsData = await dispatch(
          getLotsByIds(selectedLotsId)
        ).unwrap();
        console.log("Fetched lots:", fetchedLotsData);
        setSelectedLots(fetchedLotsData);
      } catch (error) {
        console.log("Failed to getch lots:", error);
      }
    }
    fetchSelectedLots();
  }, [selectedLotsId]);

  useEffect(() => {
    if (selectedLots) {
      const allLotsId = selectedLots.map((lot) => parseInt(lot._id, 10));

      setApplication((prev) => ({ ...prev, lotIds: allLotsId }));
    }
  }, [selectedLots]);

  const deleteHanlder = (lotId: string) => {
    setSelectedLots((prev) => {
      return prev?.filter((lot) => {
        lot._id !== lotId;
      });
    });
  };

  const openLotModal = () => {
    if (!landId) {
      alert("Please choose a land first before selecting lots.");
      return;
    }
    setIsLotModalOpen(true);
  };

  return (
    <>
      <ComponentCard
        title="Selected  Lots"
        className=" p-5 border border-gray-200 rounded-2xl dark:bg-inherit lg:p-6 mb-7"
        actions={[
          <button
            key="add"
            className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm  text-white  bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
            onClick={openLotModal}
          >
            Select Lots
          </button>,
        ]}
      >
        <div className=" overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="h-[330px] max-w-full overflow-x-auto">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Block Number
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Lot Number
                  </TableCell>

                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Lot Size
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
                    Price Per Sqm
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
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {selectedLots &&
                  selectedLots.map((lot, index) => {
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
        selectedLotsData={selectedLots}
        landId={landId}
        lotById={filterById}
        lotIds={allFilterIds}
        isOpen={isLotModalOpen}
        onClose={() => setIsLotModalOpen(false)}
        selectedData={setSelectedLots}
      />
    </>
  );
}
