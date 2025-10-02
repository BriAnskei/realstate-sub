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
  status?: string;
  createdAt?: string;
}

interface ApplicationState extends NormalizeState<ApplicationType> {
  filterById: { [key: string]: ApplicationType };
  fillIds: string[];
  filterLoading: boolean;
}

const initialState: ApplicationState = {
  byId: {},
  filterById: {},
  fillIds: [],
  allIds: [],
  error: null,
  loading: false,
  filterLoading: false,
};

const applicationSlice = createSlice({
  name: "application",
  initialState,

  reducers: {},
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
  },
});

export const {} = applicationSlice.actions;
export default applicationSlice.reducer;
