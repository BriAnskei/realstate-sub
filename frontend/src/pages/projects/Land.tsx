import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ConfirmtionModal from "../../components/modal/ConfirmtionModal";
import useConfirmationModal from "../../hooks/useConfirmationModal";

import { AppDispatch, RootState } from "../../store/store";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
  deleteLand,
  fetchLands,
  LandTypes,
} from "../../store/slices/landSlice";
import { useNavigate } from "react-router";
import LandTable from "../../components/tables/projects/LandTable";

export default function Land() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isConfirmationOpen, closeConfirmationModal, openConfirmationModal } =
    useConfirmationModal();

  const [deleteData, setDeleteData] = useState<LandTypes>({} as LandTypes);
  const [editLand, setEditLand] = useState<LandTypes | undefined>(undefined);

  const { allIds, byId, updateLoading } = useSelector(
    (state: RootState) => state.land
  );

  useEffect(() => {
    console.log("byid: ", byId);
  }, [byId]);

  const deleteHanlder = async () => {
    try {
      await dispatch(deleteLand(deleteData!._id!));
    } catch (error) {
      console.log("error: ", error);
    }
  };

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
            setDeleteData={setDeleteData}
            openConfirmationModal={openConfirmationModal}
            byId={byId}
            allIds={allIds}
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
    </>
  );
}
