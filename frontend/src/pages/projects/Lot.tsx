import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import useConfirmationModal from "../../hooks/useConfirmationModal";

import { AppDispatch, RootState } from "../../store/store";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import LotTable from "../../components/tables/projects/LotTable";
import { fetchLots, resetFilter } from "../../store/slices/lotSlice";
import { debouncedLotSearch } from "../../utils/debouncer";

export default function Lot() {
  const dispatch = useDispatch<AppDispatch>();

  const { isConfirmationOpen, closeConfirmationModal, openConfirmationModal } =
    useConfirmationModal();

  // filters
  const [searchInput, setSearchInput] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>(
    undefined
  );

  const {
    allIds,
    byId,
    updateLoading,
    loading,
    filterById,
    allFilterIds,
    filterLoading,
  } = useSelector((state: RootState) => state.lot);

  // handler filter
  useEffect(() => {
    if (searchInput?.trim() || filterStatus) {
      const payload = { landName: searchInput!, status: filterStatus };
      debouncedLotSearch(payload, dispatch);
    } else {
      dispatch(resetFilter());
    }
  }, [searchInput, filterStatus, dispatch]);

  const shouldShowFiltered = useMemo(() => {
    return (searchInput?.trim() || filterStatus) && !filterLoading
      ? true
      : false;
  }, [searchInput, filterStatus]);

  const displayData = useMemo(() => {
    return shouldShowFiltered
      ? { byId: filterById, allIds: allFilterIds }
      : { byId, allIds };
  }, [shouldShowFiltered, filterById, allFilterIds, byId, allIds]);

  return (
    <>
      <PageMeta title="Project-Lot" description="Project Lot List Table" />
      <PageBreadcrumb pageTitle="Lot" />
      <div className="space-y-6">
        <ComponentCard title="Project Lots">
          <LotTable
            isFiltering={filterLoading}
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
          />
        </ComponentCard>
      </div>
    </>
  );
}
