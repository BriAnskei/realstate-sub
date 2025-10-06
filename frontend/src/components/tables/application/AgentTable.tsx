import { SetStateAction, useEffect, useMemo, useState } from "react";
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
import { UserType, userUser } from "../../../context/UserContext";
import { ApplicationType } from "../../../store/slices/applicationSlice";
import { Role } from "../../../context/mockData";

interface AgentTableProp {
  setApplication: React.Dispatch<SetStateAction<ApplicationType>>;
  dealersData?: { otherAgentsId?: string[]; agentDealer?: string };
}

export function AgentTable({ setApplication, dealersData }: AgentTableProp) {
  const { curUser, users } = userUser();
  const [selectedAgents, setSelectedAgents] = useState<UserType[]>([]);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize selected agents from dealersData on mount/when dealersData changes
  useEffect(() => {
    if (dealersData?.otherAgentsId && !isInitialized) {
      // Find all agents that match the otherAgentsId
      const existingAgents = users.filter((user) =>
        dealersData.otherAgentsId?.includes(user._id!)
      );

      setSelectedAgents(existingAgents);
      setIsInitialized(true);
    } else if (!dealersData && !isInitialized) {
      // If no dealersData (new application), just mark as initialized
      setIsInitialized(true);
    }
  }, [dealersData, users, isInitialized]);

  // Update application state whenever selectedAgents changes
  useEffect(() => {
    if (!isInitialized) return; // Don't update until initialized

    const dealerId = dealersData?.agentDealer || curUser?._id;

    setApplication((prev) => ({
      ...prev,
      agentDealerId: dealerId,
      otherAgentIds: selectedAgents.map((agent) => parseInt(agent._id!, 10)),
    }));
  }, [selectedAgents, isInitialized]);

  const deleteHandler = (agentId: string) => {
    setSelectedAgents((prev) => prev.filter((agent) => agent._id !== agentId));
  };

  const isDealer = (agent: UserType): boolean => {
    const dealerId = dealersData?.agentDealer || curUser?._id;
    return agent._id === dealerId;
  };

  // Filter users to get only agents (for modal selection)
  const agents = useMemo(() => {
    return users.filter((user) => user.role !== Role.Employee);
  }, [users]);

  // Combine dealer with selected agents for display
  const allAgents = useMemo(() => {
    const dealerId = dealersData?.agentDealer || curUser?._id;
    const dealer = users.find((user) => user._id === dealerId);

    // Remove dealer from selectedAgents if they're there (shouldn't happen, but just in case)
    const filteredSelectedAgents = selectedAgents.filter(
      (agent) => agent._id !== dealerId
    );

    return [dealer!, ...filteredSelectedAgents];
  }, [selectedAgents, curUser, dealersData, users]);

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
                {allAgents.length > 0 ? (
                  allAgents.map((agent, index) => {
                    const dealerStatus = isDealer(agent!);

                    return (
                      <TableRow
                        key={agent._id || index}
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
                  })
                ) : (
                  <TableRow>
                    <TableCell className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                      No agents assigned. Click "Add" to select agents.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </ComponentCard>

      <AgentSelectionModal
        dealerId={dealersData?.agentDealer || curUser?._id}
        users={agents}
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        selectedData={setSelectedAgents}
        initialSelectedAgents={selectedAgents}
      />
    </>
  );
}
