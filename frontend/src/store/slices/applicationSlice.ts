import { NormalizeState } from "../../types/TypesHelper";
import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { AppApi } from "../../utils/api/applicationApi";
import { normalizeResponse } from "../../utils/normalizeResponse";
import { markLotsStatus } from "./lotSlice";
import { addNewResersation } from "./reservationSlice";
import { markSoldLots } from "./landSlice";

export const addNewApp = createAsyncThunk(
  "application/add",
  async (payload: ApplicationType, { rejectWithValue }) => {
    try {
      const res = await AppApi.add(payload);
      console.log("adding response: ", res);

      if (!res.success)
        return rejectWithValue(res.message || "Failed to add appl");

      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * @member fucntion is only callable by agents
 */
export const getRejectedAppByAgentId = createAsyncThunk(
  "application/get/rejected",
  async (agentId: string, { rejectWithValue }) => {
    try {
      const res = await AppApi.getRejectedApByAgentId(agentId);

      return res.application;
    } catch (error) {
      return rejectWithValue("Failed to update appliction:" + error);
    }
  }
);

export const updateApplication = createAsyncThunk(
  "application/update",
  async (
    payload: { applicationId: string; updateData: Partial<ApplicationType> },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await AppApi.update(payload);

      if (!res.success) {
        return rejectWithValue(res.message || "failed to update application");
      }

      dispatch(removeUpdatedAppToRejected(payload.applicationId));

      return payload;
    } catch (error) {
      return rejectWithValue("Failed to update appliction:" + error);
    }
  }
);

export const getApplicationById = createAsyncThunk(
  "application/update",
  async (applicationId: string, { rejectWithValue }) => {
    try {
      console.log("fetching applicaiotn: ", applicationId);

      const res = await AppApi.getById(applicationId);

      if (!res.success) {
        return rejectWithValue("Failed to fetch by application id");
      }

      return res.data;
    } catch (error) {
      return rejectWithValue("Error on getApplicationById" + error);
    }
  }
);

export const updateApplicationStatus = createAsyncThunk(
  "application/status/update",
  async (
    payload: {
      application: ApplicationType;
      status: "approved" | "rejected";
      note?: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const { application } = payload;
      const res = await AppApi.updateStatus(payload);

      if (!res.success) {
        return rejectWithValue(res.message || "Failed to update status");
      }

      // if status is approve process lots for reservation and display the  reservationData from the api
      if (payload.status === Status.approved) {
        dispatch(addNewResersation(res.reservation!));

        dispatch(
          markSoldLots({
            landId: application.landId,
            totalSoldLots: application.lotIds?.length,
          })
        );

        dispatch(
          markLotsStatus({
            lotsIds: application.lotIds,
            status: "reserved",
          })
        );
      }

      return payload;
    } catch (error) {
      return rejectWithValue("Failed to update appliction:" + error);
    }
  }
);

// employee only
export const fetchAllAPP = createAsyncThunk(
  "application/fetchAll",
  async (_: void, { rejectWithValue }) => {
    try {
      const res = await AppApi.getAll();
      return res.applications;
    } catch (error) {
      return rejectWithValue("error in fetchAllApp" + error);
    }
  }
);

export const filterApplication = createAsyncThunk(
  "application/filter",
  async (
    payload: {
      agentId?: string;
      filter: { searchQuery?: string; status?: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await AppApi.getFilteredApp(payload);

      return res.applications;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchByAgent = createAsyncThunk(
  "application/fetch-by-agent",
  async (agentId: string, { rejectWithValue }) => {
    try {
      const res = await AppApi.getAllByAgentId(agentId);
      return res.applications;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteApplication = createAsyncThunk(
  "application/delete",
  async (applicationId: string, { rejectWithValue }) => {
    try {
      const isSuccess = await AppApi.delete(applicationId);

      if (!isSuccess) {
        return rejectWithValue("Failed to delete applicaiton");
      }

      return applicationId;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export enum Status {
  pending = "pending",
  reject = "rejected",
  approved = "approved",
}

export interface ApplicationType {
  _id: string;
  landId?: string;
  landName?: string;
  clientName?: string;
  lotIds?: number[];
  clientId?: string;
  agentDealerId?: string;
  otherAgentIds?: number[];
  appointmentDate?: string;
  rejectionNote?: string;
  status?: string;
  createdAt?: string;
}

interface ApplicationState extends NormalizeState<ApplicationType> {
  filterById: { [key: string]: ApplicationType };
  filterIds: string[];
  filterLoading: boolean;
  updateLoading: boolean;

  // for  rejectedAPplictions - agent view only
  rejectedApplications: ApplicationType[];
  fetchingRejectedLoading: boolean;
}

const initialState: ApplicationState = {
  byId: {},
  filterById: {},
  filterIds: [],
  allIds: [],
  error: null,
  loading: false,
  updateLoading: false,
  filterLoading: false,

  rejectedApplications: [],
  fetchingRejectedLoading: false,
};

const applicationSlice = createSlice({
  name: "application",
  initialState,

  reducers: {
    setApplicaitonStatus: (state, action) => {
      const { applicationId, status, notes } = action.payload;

      const finalNote = notes ? `${status} - ${notes}` : status;

      if (state.byId[applicationId]) {
        state.byId[applicationId] = {
          ...state.byId[applicationId],
          status,
          rejectionNote: finalNote,
        };
      }
    },
    addReserveApplication: (state, action) => {
      const { allIds, byId } = normalizeResponse(action.payload);

      state.allIds = [...allIds, ...state.allIds];
      state.byId = { ...byId, ...state.byId };
    },
    resetFilters: (state) => {
      state.filterById = {};
      state.filterIds = [];
    },
    clearApplicationState: () => ({
      ...initialState,
      byId: { ...initialState.byId },
      filterById: { ...initialState.filterById },
    }),
    removeUpdatedAppToRejected: (state, action) => {
      const applictionId = action.payload;

      state.rejectedApplications = state.rejectedApplications.filter(
        (app) => app._id !== applictionId
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addNewApp.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addNewApp.fulfilled, (state, action) => {
      const { byId, allIds } = normalizeResponse(action.payload.application);

      state.byId = { ...state.byId, ...byId };
      state.allIds = [allIds[0], ...state.allIds];

      state.loading = false;
    });
    builder.addCase(addNewApp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchAllAPP.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllAPP.fulfilled, (state, action) => {
      const { byId, allIds } = normalizeResponse(action.payload);

      state.byId = byId;
      state.allIds = allIds;

      state.loading = false;
    });
    builder.addCase(fetchAllAPP.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchByAgent.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchByAgent.fulfilled, (state, action) => {
      const { byId, allIds } = normalizeResponse(action.payload);

      state.byId = byId;
      state.allIds = allIds;

      state.loading = false;
    });
    builder.addCase(fetchByAgent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(filterApplication.pending, (state) => {
      state.filterLoading = true;
    });
    builder.addCase(filterApplication.fulfilled, (state, action) => {
      const { byId, allIds } = normalizeResponse(action.payload);

      state.filterById = byId;
      state.filterIds = allIds;

      state.filterLoading = false;
    });
    builder.addCase(filterApplication.rejected, (state, action) => {
      state.filterLoading = false;
      state.error = action.payload as string;
    });
    builder.addCase(deleteApplication.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteApplication.fulfilled, (state, action) => {
      const applicationId = action.payload;

      function filterId(ids: string[]) {
        return ids.filter((id) => id !== applicationId);
      }

      state.allIds = filterId(state.allIds);
      delete state.byId[applicationId];

      if (state.filterById[applicationId]) {
        delete state.filterById[applicationId];
        state.filterIds = filterId(state.filterIds);
      }

      state.loading = false;
    });
    builder.addCase(deleteApplication.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateApplication.pending, (state) => {
      state.updateLoading = true;
    });
    builder.addCase(updateApplication.fulfilled, (state, action) => {
      const { applicationId, updateData } = action.payload;

      const existingApp = state.byId[applicationId];
      const existingFilteredApp = state.filterById[applicationId];

      if (existingApp) {
        state.byId[applicationId] = { ...existingApp, ...updateData };
      }

      // save changes if it is in the filtered state
      if (existingFilteredApp) {
        state.filterById[applicationId] = {
          ...existingFilteredApp,
          ...updateData,
        };
      }

      state.updateLoading = false;
    });
    builder.addCase(updateApplication.rejected, (state, action) => {
      state.updateLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(updateApplicationStatus.pending, (state) => {
      state.updateLoading = true;
    });
    builder.addCase(updateApplicationStatus.fulfilled, (state, action) => {
      const { application, status } = action.payload;
      const applicationId = application._id;

      state.byId[applicationId] = {
        ...state.byId[applicationId],
        status,
      };

      state.filterById[applicationId] = {
        ...state.filterById[applicationId],
        status,
      };

      state.updateLoading = false;
    });
    builder.addCase(updateApplicationStatus.rejected, (state, action) => {
      state.updateLoading = false;
      state.error = action.payload as string;
    });
    builder.addCase(getRejectedAppByAgentId.pending, (state) => {
      state.fetchingRejectedLoading = true;
    });
    builder.addCase(getRejectedAppByAgentId.fulfilled, (state, action) => {
      state.rejectedApplications = action.payload;

      console.log(
        "fetchd: ",
        action.payload,
        current(state).rejectedApplications
      );

      state.fetchingRejectedLoading = false;
    });
    builder.addCase(getRejectedAppByAgentId.rejected, (state, action) => {
      state.fetchingRejectedLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const {
  resetFilters,
  setApplicaitonStatus,
  clearApplicationState,
  removeUpdatedAppToRejected,
  addReserveApplication,
} = applicationSlice.actions;
export default applicationSlice.reducer;
