import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import useConfirmationModal from "../../hooks/useConfirmationModal";

import { AppDispatch, RootState } from "../../store/store";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import LotTable from "../../components/tables/projects/LotTable";
import { resetFilter, searchLotOnLandName } from "../../store/slices/lotSlice";
import { debouncer } from "../../utils/debouncer";
import { useFilteredData } from "../../hooks/useFilteredData";
import { userUser } from "../../context/UserContext";
import { Role } from "../../context/mockData";

export default function Lot() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    allIds,
    byId,
    updateLoading,
    loading,
    filterById,
    allFilterIds,
    filterLoading,
  } = useSelector((state: RootState) => state.lot);

  const { curUser } = userUser();

  const { isConfirmationOpen, closeConfirmationModal, openConfirmationModal } =
    useConfirmationModal();

  // filters
  const [searchInput, setSearchInput] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined
  );

  // loading
  const [searchLoading, setSearchLoading] = useState(false);

  // ref
  const debounceFilter = useRef<ReturnType<typeof debouncer> | null>(null);

  handleFilter();

  // handler filter
  useEffect(() => {
    if (searchInput?.trim() || filterStatus) {
      setSearchLoading(true);
      const payload = { landName: searchInput!, status: filterStatus };
      debounceFilter.current!(payload, dispatch);
    } else {
      dispatch(resetFilter());
    }
  }, [searchInput, filterStatus, dispatch]);

  const displayData = useFilteredData({
    originalData: { byId, allIds },
    filteredData: { byId: filterById, allIds: allFilterIds },
    filterOptions: { searchInput, filterStatus, filterLoading: filterLoading },
  });
  return (
    <>
      <PageMeta title="Project-Lot" description="Project Lot List Table" />
      <PageBreadcrumb pageTitle="Lot" />
      <div className="space-y-6">
        <ComponentCard title="Project Lots">
          <LotTable
            isFiltering={filterLoading || searchLoading}
            setFilterStatus={setFilterStatus}
            dispatch={dispatch}
            setSeachInput={setSearchInput}
            openConfirmationModal={openConfirmationModal}
            allIds={displayData.allIds}
            byId={displayData.byId}
            isLoading={loading}
            isConfirmationOpen={isConfirmationOpen}
            updateLoading={updateLoading}
            closeConfirmationModal={closeConfirmationModal}
            isEmployee={curUser?.role === Role.Employee}
          />
        </ComponentCard>
      </div>
    </>
  );

  function handleFilter() {
    if (!debounceFilter.current) {
      debounceFilter.current = debouncer(
        async (
          payload: { landName: string; status?: string },
          dispatch: AppDispatch
        ) => {
          try {
            if (!payload.landName && !payload.status) return;
            await dispatch(searchLotOnLandName(payload)).unwrap();
          } catch (error) {
            console.log("onSearchFilter error: ", error);
          } finally {
            setSearchLoading(false);
          }
        },
        400
      );
    }
  }
}
