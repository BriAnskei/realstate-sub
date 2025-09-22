import { useState } from "react";
import { EditIcon, DeleteIcon } from "../../../icons";
import { LotType } from "../../../store/slices/lotSlice";
import ComponentCard from "../../common/ComponentCard";
import LotFormModal from "../../modal/projects-modals/LotFormModal";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../ui/table";
import Badge from "../../ui/badge/Badge";

interface LotsAddedTableProp {
  lots: LotType[];

  setLots: React.Dispatch<React.SetStateAction<LotType[]>>;
}

export default function LotsAddedTable({
  lots,

  setLots,
}: LotsAddedTableProp) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, seEditData] = useState<LotType | undefined>();

  const saveUpdateHandler = (newData: LotType) => {
    setLots((prevLots) =>
      prevLots.map((lot) =>
        lot.blockNumber === newData.blockNumber &&
        lot.lotNumber === newData.lotNumber
          ? { ...lot, ...newData }
          : lot
      )
    );
  };

  const editHanlder = (lot: LotType) => {
    seEditData(lot);
    setIsModalOpen(true);
  };

  const deleteLot = (lot: LotType) => {
    setLots((prevLots) =>
      prevLots.filter(
        (prevLots) =>
          prevLots.blockNumber !== lot.blockNumber &&
          prevLots.lotNumber !== lot.lotNumber
      )
    );
  };

  const addLotsHandler = (lot: LotType) => {
    setLots((prev) => [...prev, lot]);
  };

  const closeModalHanlder = () => {
    seEditData(undefined);
    setIsModalOpen(false);
  };

  return (
    <>
      <ComponentCard
        title="Lots "
        actions={[
          <button
            key="add"
            className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm  text-white  bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
            onClick={() => setIsModalOpen(true)}
          >
            Add Lot
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
                    Total Amount
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
                    Lot Type
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
                {lots.length > 0 &&
                  lots.map((lot, index) => {
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
                          {parseInt(lot.totalAmount!, 10).toLocaleString()}
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

                        <TableCell className="px-4 py-3 ">
                          <div className="flex  gap-2">
                            <EditIcon
                              className="dark:text-gray-400 cursor-pointer"
                              onClick={() => editHanlder(lot)}
                            />
                            <DeleteIcon
                              className="text-red-600 cursor-pointer"
                              onClick={() => deleteLot(lot)}
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
      <LotFormModal
        isOpen={isModalOpen}
        onClose={closeModalHanlder}
        data={editData ?? undefined}
        saveLot={addLotsHandler}
        saveUpdate={saveUpdateHandler}
      />
    </>
  );
}
