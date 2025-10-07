import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import RejectedApplicationTable from "../../components/tables/report/rejectedApplicationTable";
import { AppDispatch, RootState } from "../../store/store";
import { useEffect, useState } from "react";
import { ApplicationType } from "../../store/slices/applicationSlice";
import { userUser } from "../../context/UserContext";
import { useApplication } from "../../context/ApplicationContext";

export default function RejectedApplication() {
  const dispatch = useDispatch<AppDispatch>();
  const { curUser } = userUser();

  const { rejectedApplications, fetchingRejectedLoading } = useSelector(
    (state: RootState) => state.application
  );

  const [rejectedAppliction, setRejectedAppliction] = useState<
    ApplicationType[] | undefined
  >(undefined);

  useEffect(() => {
    if (rejectedApplications) {
      console.log("fetched  rejections: ", rejectedApplications);
      setRejectedAppliction(rejectedApplications);
    }
  }, [rejectedApplications]);

  return (
    <>
      <PageMeta
        title="Rejected Applications"
        description="View Rejected Applications"
      />
      <PageBreadcrumb pageTitle="Rejected Applications" />
      <div className="space-y-6">
        <ComponentCard title="Rejected Applications">
          <RejectedApplicationTable
            rejectedApplictions={rejectedAppliction}
            currUser={curUser}
          />
        </ComponentCard>
      </div>
    </>
  );
}
