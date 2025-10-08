import { SetStateAction } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ContractTable from "../../components/tables/transaction/ContractTable";

export default function Contract() {
  // Mock data for display
  const mockContracts = {
    byId: {
      "1": {
        _id: "1",
        clientId: "client-001",
        agentsIds: ["agent-001", "agent-002"],
        applicaitonId: "app-001",
        contractPDF: "contract-001.pdf",
        term: "12 months",
        createdAt: "2024-01-15T10:30:00Z",
      },
      "2": {
        _id: "2",
        clientId: "client-002",
        agentsIds: ["agent-003"],
        applicaitonId: "app-002",
        contractPDF: "contract-002.pdf",
        term: "24 months",
        createdAt: "2024-02-20T14:45:00Z",
      },
      "3": {
        _id: "3",
        clientId: "client-003",
        agentsIds: ["agent-001"],
        applicaitonId: "app-003",
        contractPDF: "contract-003.pdf",
        term: "6 months",
        createdAt: "2024-03-10T09:15:00Z",
      },
      "4": {
        _id: "4",
        clientId: "client-004",
        agentsIds: ["agent-002", "agent-004"],
        applicaitonId: "app-004",
        contractPDF: "contract-004.pdf",
        term: "18 months",
        createdAt: "2024-04-05T16:20:00Z",
      },
      "5": {
        _id: "5",
        clientId: "client-005",
        agentsIds: ["agent-005"],
        applicaitonId: "app-005",
        contractPDF: "contract-005.pdf",
        term: "36 months",
        createdAt: "2024-05-12T11:00:00Z",
      },
    },
    allIds: ["1", "2", "3", "4", "5"],
  };

  return (
    <>
      <PageMeta title="Contracts" description="Manage Contracts" />
      <PageBreadcrumb pageTitle="Contracts" />
      <div className="space-y-6">
        <ComponentCard title="Contracts">
          <ContractTable
            loading={false}
            byId={mockContracts.byId}
            allIds={mockContracts.allIds}
            dispatch={undefined}
            setSearch={function (
              value: SetStateAction<string | undefined>
            ): void {
              throw new Error("Function not implemented.");
            }}
            setFilter={function (
              value: SetStateAction<string | undefined>
            ): void {
              throw new Error("Function not implemented.");
            }}
          />
        </ComponentCard>
      </div>
    </>
  );
}
