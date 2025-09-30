import { useState, useMemo } from "react";
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
import { ClientType } from "../../../store/slices/clientSlice"; // ✅ import your client type

interface ClientFormModalProp {
  byId: { [key: string]: ClientType };
  allIds: string[];
  filterLoading: boolean;
  isOpen: boolean;
  onClose: () => void;
  selectedData: (data: ClientType) => void;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const ClientSelectionModal = ({
  allIds,
  byId,
  filterLoading,
  isOpen,
  onClose,
  selectedData,
  setSearchQuery,
}: ClientFormModalProp) => {
  const [selectedClient, setSelectedClient] = useState<ClientType>();

  const saveHandler = () => {
    if (!selectedClient) return;
    selectedData(selectedClient);
    onClose();
  };

  const toggleSelection = (data: ClientType) => {
    setSelectedClient((prev) => {
      if (!prev) {
        return data;
      } else if (prev && prev._id !== data._id) {
        return data;
      } else if (prev && prev._id === data._id) {
        return prev;
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <div>
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-3">
              Select Client
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 lg:mb-7">
              Choose a client to link with this sale transaction.
            </p>
          </div>
        </div>

        <Filter
          onSearchChange={setSearchQuery}
          SearchPlaceholder="Search client..."
        />

        {/* Fixed height table container */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="h-80 overflow-y-auto custom-scrollbar">
            <Table className="min-w-full">
              <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[200px]"
                  >
                    Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[100px]"
                  >
                    Contact
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[120px]"
                  >
                    Address
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
                {allIds.length > 0 ? (
                  allIds.map((id) => {
                    const client: ClientType = byId[id];

                    return (
                      <TableRow
                        key={client._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        {/* Name */}
                        <TableCell className="px-3 py-4 text-start min-w-[200px]">
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {client.firstName} {client.middleName}{" "}
                              {client.lastName}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {client.email}
                            </span>
                          </div>
                        </TableCell>

                        {/* Contact */}
                        <TableCell className="px-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[100px]">
                          {client.contact}
                        </TableCell>

                        {/* Address */}
                        <TableCell className="px-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[120px]">
                          {client.address}
                        </TableCell>

                        {/* Checkbox */}
                        <TableCell className="px-3 py-3 min-w-[80px]">
                          <Checkbox
                            checked={client._id === selectedClient?._id}
                            onChange={() => toggleSelection(client)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">
                      No clients found.
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
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ClientSelectionModal;
