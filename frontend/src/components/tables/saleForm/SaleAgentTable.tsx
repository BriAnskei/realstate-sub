import { useEffect, useState } from "react";
import { DeleteIcon } from "../../../icons";
import { AgentType } from "../../../store/slices/agentSlice";
import ComponentCard from "../../common/ComponentCard";
import AgentSelectionModal from "../../modal/saleModal/AgentSelectionModal";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "../../ui/table";
import { userUser } from "../../../context/UserContext";

interface AgentTableProp {
  agents: AgentType[];

  setSelectedAgents: React.Dispatch<React.SetStateAction<AgentType[]>>;
}

export function SaleAgentTable({ setSelectedAgents, agents }: AgentTableProp) {
  const { curUser } = userUser();

  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const deleteHanlder = () => {
    setSelectedAgents([]);
  };

  useEffect(() => {
    // generate curr user as agent
    const curUserAgent: AgentType = {
      _id: (Math.random() * Date.now()).toString(),
      profilePicc: "",
      firstName: curUser.firstName,
      middleName: curUser.middleName,
      lastName: curUser.lastName,
      contact: "000000",
    };

    setSelectedAgents([...agents, curUserAgent]);
  }, []);

  return (
    <>
      <ComponentCard
        title="Agents"
        className="mb-7"
        actions={[
          <button
            key="add"
            className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm  text-white  bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300"
            onClick={() => setIsAgentModalOpen(true)}
          >
            Add
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
                {agents.map((agents, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {agents.firstName} {agents.middleName} {agents.lastName}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {agents.contact}
                      </TableCell>

                      <TableCell className="px-4 py-3 ">
                        <div className="flex  gap-2">
                          <DeleteIcon
                            onClick={deleteHanlder}
                            className="text-red-600 cursor-pointer"
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
      <AgentSelectionModal
        isOpen={isAgentModalOpen}
        onClose={() => setIsAgentModalOpen(false)}
        selectedData={setSelectedAgents}
      />
    </>
  );
}
