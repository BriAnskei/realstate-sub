import { DeleteIcon, EditIcon } from "../../../icons";
import { ClientType } from "../../../store/slices/clientSlice";
import DefaultProfile from "../../../icons/default-profile.svg";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Filter from "../../filter/Filter";
import Badge from "../../ui/badge/Badge";

interface ClientTableProp {
  openConfirmationModal: () => void;
  editClient: (data: ClientType) => void;
  allIds: string[];
  byId: { [key: string]: ClientType };
  setDeleteData: (data: ClientType) => void;
}

export default function ClientTable({
  openConfirmationModal,
  editClient,
  setDeleteData,
  allIds,
  byId,
}: ClientTableProp) {
  const deleteHanlder = (data: ClientType) => {
    setDeleteData(data);
    openConfirmationModal();
  };

  return (
    <>
      <Filter />
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
                  Marital Status
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
              {allIds.map((id) => {
                const client: ClientType = byId[id];

                return (
                  <TableRow key={id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <img
                            className="w-full h-full object-cover"
                            src={
                              client.profilePicc
                                ? client.profilePicc
                                : DefaultProfile
                            }
                            alt="Profile"
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {`${client.firstName}  ${client.middleName}. ${client.lastName}`}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {client.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {client.contact}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {client.Marital}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {client.address}
                    </TableCell>
                    <TableCell className="px-3 py-4 sm:px-4 text-gray-500 text-start text-sm dark:text-gray-400">
                      <Badge
                        size="sm"
                        color={
                          client.status === "available" ? "success" : "warning"
                        }
                      >
                        {client.status?.charAt(0).toLocaleUpperCase()! +
                          client.status?.slice(1)!}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 ">
                      <div className="flex  gap-2">
                        <EditIcon
                          className="dark:text-gray-400 cursor-pointer"
                          onClick={() => editClient(client)}
                        />
                        <DeleteIcon
                          className="text-red-600 cursor-pointer"
                          onClick={() => deleteHanlder(client)}
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
    </>
  );
}
