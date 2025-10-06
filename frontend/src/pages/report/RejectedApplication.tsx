import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import RejectedApplicationTable from "../../components/tables/report/rejectedApplicationTable";

export default function RejectedApplication() {
  return (
    <>
      <PageMeta
        title="Rejected Applications"
        description="View Rejected Applications"
      />
      <PageBreadcrumb pageTitle="Rejected Applications" />
      <div className="space-y-6">
        <ComponentCard title="Rejected Applications">
          <RejectedApplicationTable />
        </ComponentCard>
      </div>
    </>
  );
}
