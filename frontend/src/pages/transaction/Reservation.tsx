import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ReservationTable from "../../components/tables/transaction/ReservationTable";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect } from "react";

export default function Reservation() {
  const dispatch = useDispatch<AppDispatch>();
  const { byId, allIds } = useSelector((state: RootState) => state.reservation);

  return (
    <>
      <PageMeta title="Reservations" description="Manage Reservations" />
      <PageBreadcrumb pageTitle="Reservations" />
      <div className="space-y-6">
        <ComponentCard title="Reservations">
          <ReservationTable dispatch={dispatch} byId={byId} allIds={allIds} />
        </ComponentCard>
      </div>
    </>
  );
}
