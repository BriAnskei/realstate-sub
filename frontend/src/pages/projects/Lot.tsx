import { useEffect, useState } from "react";
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

export default function Lot() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isConfirmationOpen, closeConfirmationModal, openConfirmationModal } =
    useConfirmationModal();

  const [deleteData, setDeleteData] = useState<LandTypes>({} as LandTypes);
  const [editLand, setEditLand] = useState<LandTypes | undefined>(undefined);

  const { allIds, byId, updateLoading } = useSelector(
    (state: RootState) => state.lot
  );

  const deleteHanlder = async () => {
    try {
      await dispatch(deleteLand(deleteData!._id!));
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <>
      <PageMeta title="Project-Lot" description="Project Lot List Table" />
      <PageBreadcrumb pageTitle="Lot" />
      <div className="space-y-6">
        <ComponentCard title="Project Lots">
          <LotTable
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
