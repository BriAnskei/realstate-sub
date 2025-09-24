import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ConfirmtionModal from "../../components/modal/ConfirmtionModal";
import useConfirmationModal from "../../hooks/useConfirmationModal";

import { AppDispatch, RootState } from "../../store/store";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  deleteLand,
  LandTypes,
  updateLand,
} from "../../store/slices/landSlice";
import { useNavigate } from "react-router";
import LandTable from "../../components/tables/projects/LandTable";
import { debouncedLandSearch } from "../../utils/debouncer";
import LandFormModal from "../../components/modal/projects-modals/landFormModal";

import useLandModal from "../../hooks/projects-hooks/modal/useLandModal";

export default function Land() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isConfirmationOpen, closeConfirmationModal, openConfirmationModal } =
    useConfirmationModal();

  const [deleteData, setDeleteData] = useState<LandTypes>({} as LandTypes);
  // filter
  const [search, setSearch] = useState<string | undefined>(undefined);

  const {
    allIds,
    byId,
    updateLoading,
    loading,
    filterById,
    filterIds,
    filterLoading,
  } = useSelector((state: RootState) => state.land);

  const { isLandModalOpen, openLandModal, closeLandModal, editLand, editData } =
    useLandModal();

  // handler filter via effect
  useEffect(() => {
    const handlerSearch = () => {
      if (search?.trim()) {
        debouncedLandSearch(search, dispatch);
      }
    };
    handlerSearch();
  }, [search]);

  const deleteHanlder = async () => {
    try {
      await dispatch(deleteLand(deleteData!._id!));
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleUpdate = async (newLandData: LandTypes) => {
    try {
      console.log("Updated data: ", newLandData);

      await dispatch(updateLand(newLandData));
    } catch (error) {
      console.log("handleUpdate, ", error);
    }
  };

  const shouldShowFiltered = useMemo(() => {
    return search?.trim() && !filterLoading ? true : false;
  }, [search]);

  const displayData = useMemo(() => {
    return shouldShowFiltered
      ? { byId: filterById, allIds: filterIds }
      : { byId, allIds };
  }, [shouldShowFiltered, filterById, filterIds, byId, allIds]);

  return (
    <>
      <PageMeta title="Project-land" description="Land Management" />
      <PageBreadcrumb pageTitle="Land" />
      <div className="space-y-6">
        <ComponentCard
          title="Project-lands"
          actions={[
            <button
              key="add"
              className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm   bg-green-500 hover:bg-green-600 text-white shadow"
              onClick={() => navigate("/land/add")}
            >
              Add new
            </button>,
          ]}
        >
          <LandTable
            editLand={editLand}
            setDeleteData={setDeleteData}
            openConfirmationModal={openConfirmationModal}
            openLandModal={openLandModal}
            byId={displayData.byId}
            allIds={displayData.allIds}
            loading={loading}
            isFiltering={filterLoading}
            setSearch={setSearch}
          />
        </ComponentCard>
      </div>

      {/* Deletion */}
      <ConfirmtionModal
        title="Delete Land Project "
        message="Are you sure you want to delete this? Once deleted, all the transactions data will be lost."
        loading={updateLoading}
        isOpen={isConfirmationOpen}
        onClose={closeConfirmationModal}
        onConfirm={deleteHanlder}
      />

      {/* Form for Updating  */}
      <LandFormModal
        loading={updateLoading}
        isOpen={isLandModalOpen}
        data={editData}
        onClose={closeLandModal}
        saveUpdate={handleUpdate}
      />
    </>
  );
}
