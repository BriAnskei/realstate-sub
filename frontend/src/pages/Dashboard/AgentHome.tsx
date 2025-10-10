import PageMeta from "../../components/common/PageMeta";
import ClientMatrix from "../../components/ecommerce/ClientMatrix";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";

export default function AgentHome() {
  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="space-y-6 pb-6">
        <ClientMatrix />
        <MonthlySalesChart />
      </div>
    </>
  );
}
