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
  isOpen: boolean;
  onClose: () => void;
  selectedData: (data: ClientType) => void;
}

const ClientSelectionModal = ({
  isOpen,
  onClose,
  selectedData,
}: ClientFormModalProp) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<ClientType>();
  const [sortBy, setSortBy] = useState("");

  // ✅ Mock Clients
  const mockClients: ClientType[] = [
    {
      _id: "client_001",
      firstName: "Juan",
      middleName: "Dela",
      lastName: "Cruz",
      email: "juancruz@example.com",
      contact: "09171234567",
      Marital: "Single",
      balance: 12000,
      address: "Quezon City, Philippines",
      createdAt: "2025-01-10T08:30:00Z",
    },
    {
      _id: "client_002",
      firstName: "Maria",
      middleName: "Santos",
      lastName: "Reyes",
      email: "mariareyes@example.com",
      contact: "09181234567",
      Marital: "Married",
      balance: 5000,
      address: "Tagaytay, Philippines",
      createdAt: "2025-02-05T14:10:00Z",
    },
    {
      _id: "client_003",
      firstName: "Pedro",
      middleName: "Gomez",
      lastName: "Lopez",
      email: "pedrolopez@example.com",
      contact: "09191234567",
      Marital: "Single",
      balance: 8000,
      address: "Cebu City, Philippines",
      createdAt: "2025-03-21T09:45:00Z",
    },
    {
      _id: "client_004",
      firstName: "Ana",
      middleName: "Villanueva",
      lastName: "Cruz",
      email: "anacruz@example.com",
      contact: "09201234567",
      Marital: "Married",
      balance: 15000,
      address: "Baguio City, Philippines",
      createdAt: "2025-04-15T13:20:00Z",
    },
  ];

  const saveHandler = () => {
    if (!selectedClient) return;
    selectedData(selectedClient);
    onClose();
  };

  const filteredClients = useMemo(() => {
    let clients = mockClients.filter(
      (client) =>
        `${client.firstName} ${client.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (client.address || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "name") {
      clients = [...clients].sort((a, b) =>
        (a.firstName || "").localeCompare(b.firstName || "")
      );
    } else if (sortBy === "balance") {
      clients = [...clients].sort(
        (a, b) => (b.balance || 0) - (a.balance || 0)
      );
    }
    return clients;
  }, [searchQuery, sortBy]);

  // ✅ Handle checkbox
  const toggleSelection = (data: ClientType) => {
    setSelectedClient((prev) => {
      if (!prev) {
        return data;
      } else if (prev && prev._id !== data._id) {
        return data;
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
          onSortChange={setSortBy}
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
                {filteredClients.length > 0 ? (
                  filteredClients.map((client) => (
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
                  ))
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
