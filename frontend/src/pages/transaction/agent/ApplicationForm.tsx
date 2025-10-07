import { useEffect, useMemo, useState } from "react";
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
  Status,
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

  const { editApplication, clearUpdateContext } = useApplication();
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
    return () => clearUpdateContext();
  }, [editApplication]);

  // for messagesconfirmation moddal when submiting
  const confirmationMessage = useMemo(() => {
    return editApplication
      ? {
          tittle: "Update Application",
          message:
            "Are you sure you want to update this application? This will modify the existing application details and notify the assigned agent of the changes.",
          buttonText: "Update Application",
        }
      : {
          tittle: "Save Application",
          message:
            "Are you sure you want to save this application? This will create a new application in the system and notify the assigned agent.",
          buttonText: "Save Application",
        };
  }, [editApplication]);

  const isAllInputValid = checkInputs(application);

  const openConfirmationHandler = () => {
    const { valid, message } = isAllInputValid;
    if (!valid) {
      alert(message);
      return;
    }

    openConfirmationModal();
  };

  const handleSave = async () => {
    try {
      await dispatch(addNewApp(application)).unwrap();
    } catch (error) {
      alert(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updateObject = extractUpdateInputs(application, editApplication);

      if (!updateObject) return;

      await dispatch(
        updateApplication({
          applicationId: editApplication?._id!,
          updateData: updateObject,
        })
      );
      navigate("/application");
    } catch (error) {
      console.log("Failed updateding applicaiton");
    }
  };

  const handleSubmition = async () => {
    if (editApplication) {
      await handleUpdate();
    } else {
      await handleSave();
    }
    navigate("/application");
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
            className={`
        ${
          editApplication
            ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
            : "bg-green-600 hover:bg-green-700 focus:ring-green-500"
        }
        text-white font-medium transition-colors duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2
      `}
            size="sm"
            variant="primary"
            onClick={openConfirmationHandler}
            disabled={loading}
          >
            {editApplication ? "Update" : loading ? "Processing..." : "Submit"}
          </Button>,
        ]}
      >
        <div className="p-4 sm:p-6 dark:border-gray-800">
          {/* Client Input */}
          <ClientDetails
            settedApointmentDate={application.appointmentDate}
            setApplication={setApplication}
            selectedClientId={editApplication?.clientId ?? undefined}
          />
          <LandDetails
            setApplication={setApplication}
            selectedLandId={editApplication?.landId ?? undefined}
          />
          <AppLotTable
            selectedLotsId={editApplication?.lotIds ?? undefined}
            setApplication={setApplication}
            landId={application.landId}
          />
          <AgentTable
            setApplication={setApplication}
            dealersData={
              editApplication
                ? {
                    otherAgentsId: editApplication.otherAgentIds?.map(String),
                    agentDealer: editApplication.agentDealerId,
                  }
                : undefined
            }
          />
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
        title={confirmationMessage.tittle}
        message={confirmationMessage.message}
        buttonText={confirmationMessage.buttonText}
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
  originalData: ApplicationType | undefined
) {
  const updateChanges = new Map<
    keyof ApplicationType,
    ApplicationType[keyof ApplicationType]
  >();

  for (const key in application) {
    const typedKey = key as keyof ApplicationType;

    if (!application.hasOwnProperty(key)) continue;

    const newValue = application[typedKey];
    const oldValue = originalData?.[typedKey];

    // Deep equality check (handles primitives, arrays, objects)
    const isEqual = (() => {
      if (Array.isArray(newValue) && Array.isArray(oldValue)) {
        return JSON.stringify(newValue) === JSON.stringify(oldValue);
      }

      if (
        typeof newValue === "object" &&
        newValue !== null &&
        typeof oldValue === "object" &&
        oldValue !== null
      ) {
        return JSON.stringify(newValue) === JSON.stringify(oldValue);
      }

      return newValue == oldValue;
    })();

    if (!isEqual) {
      updateChanges.set(typedKey, newValue);
    }
  }

  if (updateChanges.size === 0) return undefined;

  // update to pending if editing
  updateChanges.set("status", Status.pending);

  return Object.fromEntries(updateChanges);
}

function checkInputs(application: ApplicationType): {
  message?: string;
  valid: boolean;
} {
  for (const [key, value] of Object.entries(application)) {
    if (key === "_id" || key === "createdAt") continue;

    if (typeof value === "string" && value.trim() === "") {
      return { message: `Please ${formatFieldName(key)}.`, valid: false };
    }

    if (Array.isArray(value) && value.length === 0) {
      return { message: `Please ${formatFieldName(key)}.`, valid: false };
    }
  }

  return { valid: true };
}

// Helper function to make field names more human-readable
function formatFieldName(field: string): string {
  const friendlyLabels: Record<string, string> = {
    landId: "select a land",
    landName: "enter the land name",
    clientName: "enter the client’s name",
    clientId: "select a client",
    lotIds: "select at least one lot",
    agentDealerId: "select an agent or dealer",
    otherAgentIds: "select more agents for this appliction",
    appointmentDate: "set the appointment date",
    status: "choose a status",
  };

  // Return predefined label if available
  if (friendlyLabels[field]) {
    return friendlyLabels[field];
  }

  // Otherwise, fallback to generic formatting
  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/([a-z])Id$/, "$1")
    .trim()
    .toLowerCase();
}
