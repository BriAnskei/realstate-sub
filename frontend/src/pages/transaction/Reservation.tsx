import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ReservationTable from "../../components/tables/transaction/ReservationTable";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect, useRef, useState } from "react";
import { debouncer } from "../../utils/debouncer";
import {
  clearReservationFilter,
  filterReservation,
  ReserveType,
} from "../../store/slices/reservationSlice";
import { useFilteredData } from "../../hooks/useFilteredData";
import useReservationAddModal from "../../hooks/projects-hooks/modal/useAddReservationModa";
import AddReservationModal from "../../components/modal/reservationModal/addReservationModal/ReservationModal";

export default function Reservation() {
  const dispatch = useDispatch<AppDispatch>();

  const { byId, allIds, filterById, filterIds, loading, filterLoading } =
    useSelector((state: RootState) => state.reservation);

  const {
    openReservationAddModal,
    isReservationAddModalOpen,
    closeReservationAddModal,
  } = useReservationAddModal();

  const [search, setSearch] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [onFilterLoading, setOnFilterLoading] = useState(false);
  const debounceFilter = useRef<ReturnType<typeof debouncer> | null>(null);

  filterHandler();

  useEffect(() => {
    if (search?.trim() || filter) {
      setOnFilterLoading(true);
      debounceFilter.current!(
        { searchQuery: search, status: filter },
        dispatch
      );
    } else {
      dispatch(clearReservationFilter());
    }
  }, [search, filter]);

  const displayData = useFilteredData<ReserveType>({
    originalData: { byId, allIds },
    filteredData: { byId: filterById, allIds: filterIds },
    filterOptions: {
      searchInput: search,
      filterStatus: filter,
      filterLoading: onFilterLoading,
    },
  });

  return (
    <>
      <PageMeta title="Reservations" description="Manage Reservations" />
      <PageBreadcrumb pageTitle="Reservations" />
      <div className="space-y-6">
        <ComponentCard
          title="Reservations"
          actions={[
            <button
              key="add"
              className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm   bg-green-500 hover:bg-green-600 text-white shadow"
              onClick={openReservationAddModal}
            >
              Add Reservation
            </button>,
          ]}
        >
          <ReservationTable
            loading={loading || onFilterLoading || loading || filterLoading}
            dispatch={dispatch}
            byId={displayData.byId}
            allIds={displayData.allIds}
            setSearch={setSearch}
            setFilter={setFilter}
          />
        </ComponentCard>
      </div>
      <AddReservationModal
        isOpen={isReservationAddModalOpen}
        onClose={closeReservationAddModal}
      />
    </>
  );

  function filterHandler() {
    if (!debounceFilter.current) {
      debounceFilter.current = debouncer(
        async (payload: { searchQuery: string; status: string }) => {
          try {
            dispatch(filterReservation(payload));
            console.log("searching: ", payload);
          } catch (error) {
            console.log("failed to filter reservation, ", error);
          } finally {
            setOnFilterLoading(false);
          }
        },
        400
      );
    }
  }
}
