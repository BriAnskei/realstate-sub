import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NormalizeState } from "../../types/TypesHelper";
import { normalizeResponse } from "../../utils/normalizeResponse";

export const addAgent = createAsyncThunk(
  "agent/add",
  async (data: AgentType, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      data = { ...data, _id: (Math.random() * 100).toString() };
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateAgent = createAsyncThunk(
  "agent/update",
  async (data: AgentType, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteAgent = createAsyncThunk(
  "agent/delete",
  async (data: AgentType, { rejectWithValue }) => {
    try {
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export interface AgentType {
  _id: string;
  profilePicc: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  contact?: string;
  address?: string;
  totalSales?: string;
  createdAt?: string;
}

interface AgentState extends NormalizeState<AgentType> {
  updateLoading: boolean;
  fetchingMore: boolean;
}

const initialState: AgentState = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
  updateLoading: false,
  fetchingMore: false,
};

const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAgent.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(addAgent.fulfilled, (state, actions) => {
        const { allIds, byId } = normalizeResponse(actions.payload);
        state.allIds.push(allIds[0]);
        state.byId = { ...state.byId, ...byId };

        state.updateLoading = false;
      })
      .addCase(addAgent.rejected, (state) => {
        state.updateLoading = false;
      })

      .addCase(updateAgent.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateAgent.fulfilled, (state, actions) => {
        state.byId[actions.payload._id] = { ...actions.payload };

        state.updateLoading = false;
      })
      .addCase(updateAgent.rejected, (state) => {
        state.updateLoading = false;
      })

      .addCase(deleteAgent.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(deleteAgent.fulfilled, (state, actions) => {
        delete state.byId[actions.payload._id];
        state.allIds = state.allIds.filter((id) => id !== actions.payload._id);
        state.updateLoading = false;
      })
      .addCase(deleteAgent.rejected, (state) => {
        state.updateLoading = false;
      });
  },
});

export const {} = agentSlice.actions;
export default agentSlice.reducer;
