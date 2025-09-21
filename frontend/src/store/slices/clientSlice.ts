import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NormalizeState } from "../../types/TypesHelper";
import { normalizeResponse } from "../../utils/normalizeResponse";

export const addClient = createAsyncThunk(
  "client/add",
  async (data: ClientType, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      data = { ...data, _id: Math.random().toString(), balance: 0 };

      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const editClient = createAsyncThunk(
  "client/update",
  async (data: ClientType, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteClient = createAsyncThunk(
  "client/delete",
  async (data: ClientType, { rejectWithValue }) => {
    try {
      console.log("deletig this client: ", data);

      await new Promise((resolve) => setTimeout(resolve, 3000));

      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export interface ClientType {
  _id: string;
  validIdPicc?: string;
  firstName?: string;
  middleName: string;
  lastName?: string;
  email?: string;
  contact?: string;
  Marital?: string;
  balance?: number;
  address?: string;
  createdAt?: string;
}

interface ClientState extends NormalizeState<ClientType> {
  updateLoading: boolean;
  fetchingMore: boolean;
}

const initialState: ClientState = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
  updateLoading: false,
  fetchingMore: false,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(addClient.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        const { byId, allIds } = normalizeResponse(action.payload);

        state.byId = { ...state.byId, ...byId };
        state.allIds = [...state.allIds, ...allIds];
        state.updateLoading = false;
      })
      .addCase(addClient.rejected, (state) => {
        state.updateLoading = false;
      })
      .addCase(editClient.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(editClient.fulfilled, (state, action) => {
        const updatedClient = action.payload; // since you return a single client

        if (state.byId[updatedClient._id]) {
          state.byId[updatedClient._id] = {
            ...state.byId[updatedClient._id],
            ...updatedClient,
          };
        }

        state.updateLoading = false;
      })
      .addCase(editClient.rejected, (state) => {
        state.updateLoading = false;
      })
      .addCase(deleteClient.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        const toBeDeleteId = action.payload._id;

        delete state.byId[toBeDeleteId];
        state.allIds = state.allIds.filter((id) => id !== toBeDeleteId);

        state.updateLoading = false;
      })
      .addCase(deleteClient.rejected, (state) => {
        state.updateLoading = false;
      }),
});

export const {} = clientSlice.actions;
export default clientSlice.reducer;
