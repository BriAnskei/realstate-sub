import { SetStateAction } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ContractTable from "../../components/tables/transaction/ContractTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";

export default function Contract() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, byId, allIds } = useSelector(
    (state: RootState) => state.contract
  );

  return (
    <>
      <PageMeta title="Contracts" description="Manage Contracts" />
      <PageBreadcrumb pageTitle="Contracts" />
      <div className="space-y-6">
        <ComponentCard title="Contracts">
          <ContractTable
            loading={loading}
            byId={byId}
            allIds={allIds}
            dispatch={dispatch}
          />
        </ComponentCard>
      </div>
    </>
  );
}
