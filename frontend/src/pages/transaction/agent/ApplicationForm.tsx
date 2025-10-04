import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ComponentCard from "../../../components/common/ComponentCard";
import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import PageMeta from "../../../components/common/PageMeta";
import ClientDetails from "../../../components/form/agents/ClientDetails";
import LandDetails from "../../../components/form/agents/LandDetails";
import { AgentTable } from "../../../components/tables/application/AgentTable";
import Button from "../../../components/ui/button/Button";

import { AppDispatch, RootState } from "../../../store/store";

import backtoTop from "../../../icons/back-to-top-icon.svg";
import {
  addNewApp,
  ApplicationType,
  updateApplication,
} from "../../../store/slices/applicationSlice";
import { AppLotTable } from "../../../components/tables/application/AppLotTable";
import { useNavigate } from "react-router";
import useConfirmationModal from "../../../hooks/useConfirmationModal";
import ConfirmationModal from "../../../components/modal/ConfirmtionModal";
import { useApplication } from "../../../context/ApplicationContext";

const ApplicationForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { editApplication, setEditApplication } = useApplication();
  const { loading } = useSelector((state: RootState) => state.application);

  // application input
  const [application, setApplication] = useState<ApplicationType>({
    _id: "",
    landId: "",
    landName: "",
    clientName: "",
    lotIds: [],
    clientId: "",
    agentDealerId: "",
    otherAgentIds: [],
    appointmentDate: "",
    createdAt: "",
  });

  const { isConfirmationOpen, openConfirmationModal, closeConfirmationModal } =
    useConfirmationModal();

  useEffect(() => {
    if (editApplication) {
      setApplication(editApplication);
    }

    // reset when unrendering
    return () => setEditApplication(undefined);
  }, [editApplication]);

  const isAllInputValid = checkInputs(application);

  const openConfirmationHandler = () => {
    if (!isAllInputValid()) {
      alert("Kindly fill out all fields in the application form.");
      return;
    }

    openConfirmationModal();
  };

  const handleSave = async () => {
    try {
      await dispatch(addNewApp(application)).unwrap();
    } catch (error) {
      console.log("Failed to add application");
    }
  };

  const handleUpdate = async () => {
    try {
      const updateObject = extractUpdateInputs(application, editApplication);

      await dispatch(
        updateApplication({
          applicationId: editApplication?._id!,
          updateData: updateObject,
        })
      );
    } catch (error) {
      console.log("Failed to update application", error);
    }
  };

  const handleSubmition = async () => {
    try {
      if (!isAllInputValid()) {
        alert("Kindly fill out all fields in the application form.");
        return;
      }

      if (editApplication) {
        await handleUpdate();
      } else {
        await handleSave();
      }
      navigate("/application");
    } catch (error) {}
  };

  return (
    <>
      <PageMeta title="Application Form" description="Transaction-form" />
      <PageBreadcrumb
        pageTitle={editApplication ? "Update Application" : "New Application"}
      />
      <ComponentCard
        title="Application Form"
        actions={[
          <Button
            className="bg-green-500"
            size="sm"
            variant="primary"
            onClick={openConfirmationHandler}
          >
            {loading ? "Processing..." : "Submit "}
          </Button>,
        ]}
      >
        <div className="p-4 sm:p-6 dark:border-gray-800">
          {/* Client Input */}
          <ClientDetails setApplication={setApplication} />
          <LandDetails setApplication={setApplication} />
          <AppLotTable
            setApplication={setApplication}
            landId={application.landId}
          />
          <AgentTable setApplication={setApplication} />
          <div className="flex  justify-center items-center">
            <img
              src={backtoTop}
              className="cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            />
          </div>
        </div>
      </ComponentCard>

      <ConfirmationModal
        title="Save Application"
        message="Are you sure you want to save this application? This will create a new application in the system and notify the assigned agent."
        buttonText="Save Application"
        cancelText="Cancel"
        variant="success"
        icon={
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-6 h-6 text-blue-600"
          >
            <path
              d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
        bgIcon="bg-blue-100"
        bgButton="bg-blue-600 hover:bg-blue-700"
        isOpen={isConfirmationOpen}
        onClose={closeConfirmationModal}
        onConfirm={handleSubmition}
        loading={loading}
      />
    </>
  );
};

export default ApplicationForm;

function extractUpdateInputs(
  application: ApplicationType,
  data: ApplicationType | undefined
) {
  const updateChanges = new Map<
    keyof ApplicationType,
    ApplicationType[keyof ApplicationType]
  >();
  for (const key in application) {
    const typedKey = key as keyof ApplicationType;
    if (
      application.hasOwnProperty(key) &&
      application[typedKey] !== data?.[typedKey]
    ) {
      updateChanges.set(typedKey, application[typedKey]);
    }
  }

  return Object.fromEntries(updateChanges);
}

function checkInputs(application: ApplicationType) {
  return () => {
    for (const [key, value] of Object.entries(application)) {
      // skip validation for _id
      if (key === "_id" || key === "createdAt") {
        continue;
      }

      // validate strings
      if (typeof value === "string" && value.trim() === "") {
        console.log("no value in ", key, value);

        return false;
      }

      // validate arrays
      if (Array.isArray(value) && value.length === 0) {
        console.log("no value in ", key, value);

        return false;
      }
    }

    return true;
  };
}
