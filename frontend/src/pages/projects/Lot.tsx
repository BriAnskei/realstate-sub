import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ConfirmtionModal from "../../components/modal/ConfirmtionModal";
import useConfirmationModal from "../../hooks/useConfirmationModal";

import { AppDispatch, RootState } from "../../store/store";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { deleteLand, LandTypes } from "../../store/slices/landSlice";
import { useNavigate } from "react-router";
import LotTable from "../../components/tables/projects/LotTable";
import { LotType, searchLotOnLandName } from "../../store/slices/lotSlice";
import { debouncedSearch } from "../../utils/debouncer";

export default function Lot() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isConfirmationOpen, closeConfirmationModal, openConfirmationModal } =
    useConfirmationModal();

  const [editLand, setEditLand] = useState<LandTypes | undefined>(undefined);

  // filters
  const [searchInput, setSearchInput] = useState<string | undefined>();

  const { allIds, byId, updateLoading, loading, filterById, allFilterIds } =
    useSelector((state: RootState) => state.lot);

  // handler filter
  useEffect(() => {
    if (searchInput !== undefined) {
      debouncedSearch(searchInput, dispatch);
    }
  }, [searchInput, dispatch]);

  const dataDistributor = useCallback(() => {
    if (searchInput !== undefined && searchInput !== "") {
      console.log("Retrung search");

      // user is searching
      return { byId: filterById, allIds: allFilterIds };
    }
    return { byId, allIds: allIds };
  }, [searchInput, allIds, byId, allFilterIds, filterById]);

  return (
    <>
      <PageMeta title="Project-Lot" description="Project Lot List Table" />
      <PageBreadcrumb pageTitle="Lot" />
      <div className="space-y-6">
        <ComponentCard title="Project Lots">
          <LotTable
            dispatch={dispatch}
            setSeachInput={setSearchInput}
            openConfirmationModal={openConfirmationModal}
            allIds={dataDistributor().allIds}
            byId={dataDistributor().byId}
            isLoading={loading}
            isConfirmationOpen={isConfirmationOpen}
            updateLoading={updateLoading}
            closeConfirmationModal={closeConfirmationModal}
          />
        </ComponentCard>
      </div>

      {/* Deletion */}
    </>
  );
}
