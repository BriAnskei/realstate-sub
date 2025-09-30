import { SetStateAction, use, useEffect, useMemo, useState } from "react";
import { DeleteIcon } from "../../../icons";

import ComponentCard from "../../common/ComponentCard";
import AgentSelectionModal from "../../modal/saleModal/AgentSelectionModal";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../ui/table";
import { Role, UserType, userUser } from "../../../context/UserContext";
import { AgentType } from "../../../store/slices/agentSlice";
import { ApplicationType } from "../../../store/slices/applicationSlice";

interface AgentTableProp {
  setApplication: React.Dispatch<SetStateAction<ApplicationType>>;
}

export function AgentTable({ setApplication }: AgentTableProp) {
  const [selectedAgents, setSelectedAgents] = useState<UserType[] | undefined>(
    undefined
  );
  const { curUser, users } = userUser();

  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  const deleteHandler = (agentId: string) => {
    // Filter out the agent to delete, but keep dealers
    setSelectedAgents((prev) => prev?.filter((agent) => agent._id !== agentId));
  };

  const isDealer = (agent: UserType) => {
    return agent._id === curUser?._id;
  };

  useEffect(() => {
    if (curUser) {
      setApplication((prev) => ({ ...prev, agentDealerId: curUser?._id }));
    }
  }, [curUser]);

  useEffect(() => {
    if (selectedAgents) {
      const agentsIds = selectedAgents.map((agent) => agent._id!);
      setApplication((prev) => ({ ...prev, otherAgentIds: agentsIds }));
    }
  }, [selectedAgents]);

  const agents = useMemo(() => {
    // We only need agents
    return users.filter((user) => user.role !== Role.Employee);
  }, [users]);

  // For agents selected table
  const allAgents = useMemo(() => {
    const selected: UserType[] = selectedAgents ?? [];
    return [curUser!, ...selected];
  }, [selectedAgents]);

  return (
    <>
      <ComponentCard
        title="Agents"
        className="mb-7"
        actions={[
          <button
            key="add"
            className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm text-white bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
            onClick={() => setIsAgentModalOpen(true)}
          >
            Add
          </button>,
        ]}
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="h-[330px] max-w-full overflow-x-auto">
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
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {allAgents &&
                  allAgents.map((agent, index) => {
                    const dealerStatus = isDealer(agent);

                    return (
                      <TableRow
                        key={index}
                        className={
                          dealerStatus ? "bg-blue-50 dark:bg-blue-900/20" : ""
                        }
                      >
                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            {agent.firstName} {agent.middleName}{" "}
                            {agent.lastName}
                            {dealerStatus && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-300">
                                Dealer
                              </span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                          {agent.email}
                        </TableCell>

                        <TableCell className="px-4 py-3">
                          <div className="flex gap-2">
                            {!dealerStatus ? (
                              <DeleteIcon
                                onClick={() => deleteHandler(agent._id!)}
                                className="text-red-600 cursor-pointer hover:text-red-800"
                              />
                            ) : (
                              <div className="text-gray-400 text-xs">
                                Protected
                              </div>
                            )}
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

      <AgentSelectionModal
        dealerId={curUser?._id}
        users={agents}
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        selectedData={setSelectedAgents}
      />
    </>
  );
}
