import { useEffect, useRef, useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import ApplicationTable from "../../components/tables/transaction/applicationTable";

import { userUser } from "../../context/UserContext";
import { Role } from "../../context/mockData";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import {
  deleteApplication,
  filterApplication,
} from "../../store/slices/applicationSlice";
import { debouncer } from "../../utils/debouncer";

export default function Application() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { curUser } = userUser();

  const [search, setSearch] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [searchLoading, setSearchLoading] = useState(false);

  const debounceFilter = useRef<ReturnType<typeof debouncer> | null>(null);

  const deleteHanler = async (applicationId: string) => {
    try {
      await dispatch(deleteApplication(applicationId)).unwrap();
    } catch (error) {
      console.log("Failed to delete application, ", error);
    }
  };

  // filter hanlder
  filterDebounceHanlder();
  useEffect(() => {
    if (search?.trim() || filter) {
      setSearchLoading(true);
      debounceFilter.current!(search, filter);
    }
  }, [search, filter]);

  return (
    <>
      <PageMeta title="Project-land" description="Land Management" />
      <PageBreadcrumb pageTitle="Application" />
      <div className="space-y-6">
        <ComponentCard
          title="Applications"
          actions={
            curUser?.role === Role.Agent
              ? [
                  <button
                    key="New Application"
                    className="inline-flex items-center justify-center gap-2 rounded-lg transition  px-4 py-3 text-sm   bg-green-500 hover:bg-green-600 text-white shadow"
                    onClick={() => navigate("/application/form")}
                  >
                    <span className="hidden sm:inline">New Application</span>
                    <span className="sm:hidden">New</span>
                  </button>,
                ]
              : undefined
          }
        >
          <ApplicationTable
            dispatch={dispatch}
            navigate={navigate}
            agentData={curUser?.role === Role.Agent ? curUser : undefined}
            deleteApplicationHanlder={deleteHanler}
            isEmployee={curUser?.role === Role.Employee}
            setSearch={setSearch}
            filter={filter}
            search={search}
            setFilterStatus={setFilter}
            isFiltering={searchLoading}
          />
        </ComponentCard>
      </div>
    </>
  );

  function filterDebounceHanlder() {
    if (!debounceFilter.current) {
      debounceFilter.current = debouncer(async (search, filter) => {
        try {
          await dispatch(
            filterApplication({
              agentId: curUser?.role === Role.Agent ? curUser._id : undefined,
              filter: { searchQuery: search, status: filter },
            })
          ).unwrap();
        } catch (error) {
          console.log("Failed to fetch filter", error);
        } finally {
          setSearchLoading(false);
        }
      }, 400);
    }
  }
}
