import { SetStateAction } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ApplicationTable from "../../components/tables/transaction/applicationTable";
import { ApplicationType } from "../../store/slices/applicationSlice";
import { Role, userUser } from "../../context/UserContext";

export default function Application() {
  const { curUser } = userUser();
  return (
    <>
      <PageMeta title="Project-land" description="Land Management" />
      <PageBreadcrumb pageTitle="Land" />
      <div className="space-y-6">
        <ComponentCard
          title="Applications"
          actions={
            curUser?.role === Role.Agent
              ? [
                  <button
                    key="New Application"
                    className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm   bg-green-500 hover:bg-green-600 text-white shadow"
                  >
                    <span className="hidden sm:inline">New Application</span>
                    <span className="sm:hidden">New</span>
                  </button>,
                ]
              : undefined
          }
        >
          <ApplicationTable
            isEmployee={curUser?.role === Role.Employee}
            openConfirmationModal={function (): void {
              throw new Error("Function not implemented.");
            }}
            editApplication={function (data: ApplicationType): void {
              throw new Error("Function not implemented.");
            }}
            setDeleteData={function (data: ApplicationType): void {
              throw new Error("Function not implemented.");
            }}
            setSearch={function (
              value: SetStateAction<string | undefined>
            ): void {
              throw new Error("Function not implemented.");
            }}
            search={undefined}
            searchLoading={false}
            isLoading={false}
            filterLoading={false}
            openApplicationInfoModal={function (
              applicationData: ApplicationType
            ): void {
              throw new Error("Function not implemented.");
            }}
          />
        </ComponentCard>
      </div>
    </>
  );
}
