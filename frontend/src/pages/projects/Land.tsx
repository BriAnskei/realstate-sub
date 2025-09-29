import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  searchLand,
  updateLand,
} from "../../store/slices/landSlice";
import { useNavigate } from "react-router";
import LandTable from "../../components/tables/projects/LandTable";
import { debouncer } from "../../utils/debouncer";
import LandFormModal from "../../components/modal/projects-modals/landFormModal";

import useLandModal from "../../hooks/projects-hooks/modal/useLandModal";
import { Role, userUser } from "../../context/UserContext";

export default function Land() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { curUser } = userUser();

  const {
    allIds,
    byId,
    updateLoading,
    loading,
    filterById,
    filterIds,
    filterLoading,
  } = useSelector((state: RootState) => state.land);

  const { isConfirmationOpen, closeConfirmationModal, openConfirmationModal } =
    useConfirmationModal();

  const { isLandModalOpen, openLandModal, closeLandModal, editLand, editData } =
    useLandModal();

  const [deleteData, setDeleteData] = useState<LandTypes>({} as LandTypes);
  // filter
  const [search, setSearch] = useState<string | undefined>(undefined);

  // loading
  const [searchLoading, setSearchLoading] = useState(false);

  // refs
  const debouncedSearchRef = useRef<ReturnType<typeof debouncer> | null>(null);

  filterHanlder();

  // handler filter via effect
  useEffect(() => {
    const handlerSearch = () => {
      if (search?.trim()) {
        setSearchLoading(true);
        debouncedSearchRef.current!(search);
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
          actions={
            curUser?.role === Role.Employee
              ? [
                  <button
                    key="add"
                    className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm   bg-green-500 hover:bg-green-600 text-white shadow"
                    onClick={() => navigate("/land/add")}
                  >
                    Add new
                  </button>,
                ]
              : undefined
          }
        >
          <LandTable
            editLand={editLand}
            setDeleteData={setDeleteData}
            openConfirmationModal={openConfirmationModal}
            openLandModal={openLandModal}
            byId={displayData.byId}
            allIds={displayData.allIds}
            loading={loading}
            isFiltering={filterLoading || searchLoading}
            setSearch={setSearch}
            isEmployee={curUser?.role === Role.Employee}
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

  function filterHanlder() {
    if (!debouncedSearchRef.current) {
      debouncedSearchRef.current = debouncer(async (landName: string) => {
        try {
          await dispatch(searchLand(landName));
        } catch (error) {
          console.log("onSearchFilter error: ", error);
        } finally {
          setSearchLoading(false);
        }
      }, 400);
    }
  }
}
