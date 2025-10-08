import Filter from "../../../filter/Filter";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../../ui/table";
import { ClientType } from "./ReservationModal";

interface ClientSelectorProp {
  setClientSearch: React.Dispatch<React.SetStateAction<string>>;
  setClientSort: React.Dispatch<React.SetStateAction<string>>;
  filteredClients: ClientType[];
  selectedClient: ClientType | null;
  getFullName: (client: ClientType) => string;
  setSelectedClient: React.Dispatch<React.SetStateAction<ClientType | null>>;
}

const ClientSelector = ({
  setClientSearch,
  setClientSort,
  filteredClients,
  selectedClient,
  getFullName,
  setSelectedClient,
}: ClientSelectorProp) => {
  return (
    <>
      <Filter
        onSearchChange={setClientSearch}
        SearchPlaceholder="Search client by name or contact..."
        onSortChange={setClientSort}
      />

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="h-80 overflow-y-auto custom-scrollbar">
          <Table className="min-w-full">
            <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-3 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400 sm:text-theme-xs"
                >
                  Full Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-3 py-3 font-medium text-gray-500 text-start text-xs dark:text-gray-400 sm:text-theme-xs"
                >
                  Contact
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
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <TableRow
                    key={client._id}
                    className={`transition-colors cursor-pointer ${
                      selectedClient?._id === client._id
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                  >
                    <TableCell className="px-3 py-4 text-start">
                      <span className="block font-medium text-gray-800 text-sm dark:text-white/90">
                        {getFullName(client)}
                      </span>
                    </TableCell>

                    <TableCell className="px-3 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                      {client.contact || "N/A"}
                    </TableCell>

                    <TableCell className="px-3 py-3">
                      <input
                        type="radio"
                        checked={selectedClient?._id === client._id || false}
                        onChange={() => setSelectedClient(client)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
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
    </>
  );
};

export default ClientSelector;
