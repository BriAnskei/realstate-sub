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
import { AgentType } from "../../../store/slices/agentSlice";
import DefaultProfile from "../../../icons/default-profile.svg";

interface AgentFormModalProp {
  isOpen: boolean;
  onClose: () => void;
  selectedData: React.Dispatch<React.SetStateAction<AgentType[]>>;
}

const AgentSelectionModal = ({
  isOpen,
  onClose,
  selectedData,
}: AgentFormModalProp) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgents, setSelectedAgents] = useState<AgentType[]>([]);
  const [sortBy, setSortBy] = useState("");

  // ✅ Mock Agents
  const mockAgents: AgentType[] = [
    {
      _id: "agent_001",
      profilePicc: "/images/agent1.jpg",
      firstName: "Maria",
      middleName: "Santos",
      lastName: "Reyes",
      email: "maria.reyes@example.com",
      contact: "09171234567",
      address: "Quezon City, PH",
      totalSales: "15",
      createdAt: "2025-01-12T09:30:00Z",
    },
    {
      _id: "agent_002",
      profilePicc: "/images/agent2.jpg",
      firstName: "Juan",
      middleName: "Dela",
      lastName: "Cruz",
      email: "juan.cruz@example.com",
      contact: "09181234567",
      address: "Makati, PH",
      totalSales: "25",
      createdAt: "2025-02-20T11:15:00Z",
    },
    {
      _id: "agent_003",
      profilePicc: "/images/agent3.jpg",
      firstName: "Ana",
      middleName: "Lopez",
      lastName: "Garcia",
      email: "ana.garcia@example.com",
      contact: "09221234567",
      address: "Cebu City, PH",
      totalSales: "10",
      createdAt: "2025-03-10T14:50:00Z",
    },
  ];

  const saveHandler = () => {
    if (selectedAgents.length === 0) return;
    selectedData((prev) => ({ ...prev, ...selectedAgents }));
    onClose();
  };

  const filteredAgents = useMemo(() => {
    let agents = mockAgents.filter(
      (agent) =>
        (agent.firstName || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (agent.lastName || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (agent.email || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "sales") {
      agents = [...agents].sort(
        (a, b) =>
          parseFloat(b.totalSales || "0") - parseFloat(a.totalSales || "0")
      );
    }
    return agents;
  }, [searchQuery, sortBy]);

  // ✅ Handle checkbox (multi-select)
  const toggleSelection = (agent: AgentType) => {
    setSelectedAgents((prev) => {
      if (prev.find((a) => a._id === agent._id)) {
        return prev.filter((a) => a._id !== agent._id); // remove
      } else {
        return [...prev, agent]; // add
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <div>
            <h4 className="text-2xl font-semibold text-gray-800 dark:text-white/90 mb-3">
              Select Agents
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 lg:mb-7">
              Choose multiple agents to assign to this transaction.
            </p>
          </div>
        </div>

        <Filter
          onSearchChange={setSearchQuery}
          SearchPlaceholder="Search agent..."
          onSortChange={setSortBy}
          sortOptions={[{ label: "By Sales", value: "sales" }]}
        />

        {/* Fixed height table container */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="h-80 overflow-y-auto custom-scrollbar">
            <Table className="min-w-full">
              <TableHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[150px]"
                  >
                    Agent
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-3 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 min-w-[100px]"
                  >
                    Email
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
                {filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    <TableRow
                      key={agent._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      {/* Agent Info */}
                      <TableCell className="px-3 py-4 text-start min-w-[150px]">
                        <div className="flex items-center gap-3">
                          <img
                            src={DefaultProfile}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {agent.firstName} {agent.middleName}{" "}
                              {agent.lastName}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              {agent.contact}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Email */}
                      <TableCell className="px-3 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[100px]">
                        {agent.email}
                      </TableCell>

                      {/* Checkbox */}
                      <TableCell className="px-3 py-3 min-w-[80px]">
                        <Checkbox
                          checked={
                            !!selectedAgents.find((a) => a._id === agent._id)
                          }
                          onChange={() => toggleSelection(agent)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="px-3 py-6 text-center text-gray-500 dark:text-gray-400">
                      No agents found.
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
            Save({selectedAgents.length})
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AgentSelectionModal;
