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

// use for employee
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
}

const initialState: ApplicationState = {
  byId: {},
  filterById: {},
  filterIds: [],
  allIds: [],
  error: null,
  loading: false,
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
  },
});

export const { resetFilters } = applicationSlice.actions;
export default applicationSlice.reducer;
