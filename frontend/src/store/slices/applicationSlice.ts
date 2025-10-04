import { NormalizeState } from "../../types/TypesHelper";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppApi } from "../../utils/api/applicationApi";
import { normalizeResponse } from "../../utils/normalizeResponse";

export const addNewApp = createAsyncThunk(
  "application/add",
  async (payload: ApplicationType, { rejectWithValue }) => {
    try {
      const res = await AppApi.add(payload);

      if (!res.success)
        return rejectWithValue(res.message || "Failed to add appl");

      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateApplication = createAsyncThunk(
  "application/update",
  async (
    payload: { applicationId: string; updateData: Partial<ApplicationType> },
    { rejectWithValue }
  ) => {
    try {
      const res = await AppApi.update(payload);

      if (!res.success) {
        return rejectWithValue(res.message || "failed to update application");
      }

      return payload;
    } catch (error) {
      return rejectWithValue(error);
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
      return rejectWithValue(error);
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

      console.log("api response: ", res);
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
  status?: Status.pending;
  createdAt?: string;
}

interface ApplicationState extends NormalizeState<ApplicationType> {
  filterById: { [key: string]: ApplicationType };
  filterIds: string[];
  filterLoading: boolean;
  updateLoading: boolean;
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
};

const applicationSlice = createSlice({
  name: "application",
  initialState,

  reducers: {
    resetFilters: (state) => {
      state.filterById = {};
      state.filterIds = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addNewApp.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addNewApp.fulfilled, (state, action) => {
      const { byId, allIds } = normalizeResponse(action.payload.data);

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
  },
});

export const { resetFilters } = applicationSlice.actions;
export default applicationSlice.reducer;
