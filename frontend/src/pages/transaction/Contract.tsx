import { RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ContractTable from "../../components/tables/transaction/ContractTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { debouncer } from "../../utils/debouncer";
import { userUser } from "../../context/UserContext";
import { ContractType, filterContract } from "../../store/slices/contractSlice";
import { Role } from "../../context/mockData";
import { useFilteredData } from "../../hooks/useFilteredData";

export default function Contract() {
  const { curUser } = userUser();
  const dispatch = useDispatch<AppDispatch>();
  const {
    loading,
    byId,
    allIds,
    filterLoading,
    filteredContractById,
    filteredContractIds,
  } = useSelector((state: RootState) => state.contract);

  // filters
  const debounceFilter = useRef<ReturnType<typeof debouncer> | null>(null);
  const [filterClientName, setFilterClientName] = useState<string | undefined>(
    undefined
  );
  const [onFilterLoading, setOnFilterLoading] = useState(false);

  filterHandler(debounceFilter, dispatch, setOnFilterLoading);

  useEffect(() => {
    if (filterClientName?.trim()) {
      setOnFilterLoading(true);
      debounceFilter.current!({
        clientName: filterClientName,
        ...(curUser?.role === Role.Agent && { agentId: curUser._id }),
      });
    }
  }, [filterClientName, curUser]);

  const displayData = useFilteredData<ContractType>({
    originalData: { byId, allIds },
    filteredData: { byId: filteredContractById, allIds: filteredContractIds },
    filterOptions: {
      searchInput: filterClientName,
      filterLoading: onFilterLoading || filterLoading,
    },
  });

  return (
    <>
      <PageMeta title="Contracts" description="Manage Contracts" />
      <PageBreadcrumb pageTitle="Contracts" />
      <div className="space-y-6">
        <ComponentCard title="Contracts">
          <ContractTable
            filterAgent={setFilterClientName}
            loading={loading || onFilterLoading || filterLoading}
            byId={displayData.byId}
            allIds={displayData.allIds}
            dispatch={dispatch}
          />
        </ComponentCard>
      </div>
    </>
  );
}
function filterHandler(
  debounceFilter: RefObject<((...args: any[]) => void) | null>,
  dispatch: AppDispatch,
  setOnFilterLoading: {
    (value: SetStateAction<boolean>): void;
    (arg0: boolean): void;
  }
) {
  if (!debounceFilter.current) {
    debounceFilter.current = debouncer(
      async (payload: { clientName: string; agentId?: string }) => {
        try {
          await dispatch(filterContract(payload));
        } catch (error) {
          console.log("Failt to filter contract");
        } finally {
          setOnFilterLoading(false);
        }
      },
      400
    );
  }
}
