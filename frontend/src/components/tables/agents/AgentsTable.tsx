import { DeleteIcon, EditIcon } from "../../../icons";
import DefaultProfile from "../../../icons/default-profile.svg";
import { AgentType } from "../../../store/slices/agentSlice";
import Filter from "../../filter/Filter";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

interface AgentsTableProp {
  openConfirmationModal: () => void;
  editAgent: (data: AgentType) => void;
  allIds: string[];
  byId: { [key: string]: AgentType };
  setDeleteData: (data: AgentType) => void;
}

export default function AgentsTable({
  openConfirmationModal,
  editAgent,
  setDeleteData,
  allIds,
  byId,
}: AgentsTableProp) {
  const deleteHanlder = (data: AgentType) => {
    setDeleteData(data);
    openConfirmationModal();
  };

  return (
    <>
      <Filter
        sortOptions={[
          { label: "Highest to lowest", value: "0" },
          { label: "Lowest to hisgest", value: "0" },
        ]}
        sortTitle="All "
      />
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
                  Address
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Total Sales
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
                const agent: AgentType = byId[id];

                return (
                  <TableRow key={id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <img
                            className="w-full h-full object-cover"
                            src={
                              agent.profilePicc
                                ? agent.profilePicc
                                : DefaultProfile
                            }
                            alt="Profile"
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {`${agent.firstName} ${
                              agent.middleName ? agent.middleName + ". " : ""
                            }${agent.lastName}`}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {agent.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {agent.contact}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {agent.address}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {agent.address}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex gap-2">
                        <EditIcon
                          className="dark:text-gray-400 cursor-pointer"
                          onClick={() => editAgent(agent)}
                        />
                        <DeleteIcon
                          className="text-red-600 cursor-pointer"
                          onClick={() => deleteHanlder(agent)}
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
