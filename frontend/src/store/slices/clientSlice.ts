import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NormalizeState } from "../../types/TypesHelper";
import { normalizeResponse } from "../../utils/normalizeResponse";
import { ClientApi } from "../../utils/api/clientApi";
import { RootState } from "../store";

export const addClient = createAsyncThunk(
  "client/add",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const res = await ClientApi.createClient(data);

      console.log("api respomse: ", res);

      if (!res.success) {
        console.log("faile:", res.message);

        return rejectWithValue(res.message || "Failed to add Client");
      }

      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const searchClient = createAsyncThunk(
  "client/search",
  async (payload: { query?: string; status?: string }, { rejectWithValue }) => {
    try {
      const { query, status } = payload;
      const res = await ClientApi.search({ name: query, status });

      return res.clients;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getClients = createAsyncThunk(
  "client/fetch",
  async (_: void, { rejectWithValue }) => {
    try {
      const res = await ClientApi.getClients();

      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getClientById = createAsyncThunk(
  "client/get-byId",
  async (clientId: string, { rejectWithValue, getState }) => {
    try {
      // check in state if the client exist before fetching
      const state = getState() as RootState;
      const { byId } = state.client;
      if (byId[clientId]) {
        return byId[clientId];
      }

      const response = await ClientApi.getClientById(clientId);
      const { success, client, message } = response;

      if (!success) {
        return rejectWithValue(message || "Failed to find client");
      }

      return client!;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateClientData = createAsyncThunk(
  "client/update",
  async (
    payload: { data: Partial<ClientType>; clientId: number },
    { rejectWithValue }
  ) => {
    try {
      const { data, clientId } = payload;

      const res = await ClientApi.updateClient(clientId, data);

      if (!res.success) {
        return rejectWithValue(res.message || "Failed to update client");
      }

      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteClient = createAsyncThunk(
  "client/delete",
  async (data: ClientType, { rejectWithValue }) => {
    try {
      await ClientApi.deleteClient(parseInt(data._id, 10));

      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export interface ClientType {
  _id: string;
  profilePicc?: string | File;
  firstName?: string;
  middleName: string;
  lastName?: string;
  email?: string;
  contact?: string;
  Marital?: string;
  address?: string;
  status?: string;
  createdAt?: string;
}

interface ClientState extends NormalizeState<ClientType> {
  updateLoading: boolean;
  fetchingMore: boolean;
  filterLoading: boolean;
  filterById: { [ket: string]: ClientType };
  filterIds: string[];
}

const initialState: ClientState = {
  byId: {},
  allIds: [],
  filterById: {},
  filterIds: [],
  filterLoading: false,
  loading: false,
  error: null,
  updateLoading: false,
  fetchingMore: false,
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    resetClientFilter(state) {
      state.filterById = {};
      state.filterIds = [];
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(addClient.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(addClient.fulfilled, (state, action) => {
        const { byId, allIds } = normalizeResponse(action.payload.client);

        state.byId = { ...byId, ...state.byId };
        state.allIds = [...allIds, ...state.allIds];
        state.updateLoading = false;
      })
      .addCase(addClient.rejected, (state, action) => {
        state.error = action.payload as string;
        state.updateLoading = false;
      })
      .addCase(updateClientData.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateClientData.fulfilled, (state, action) => {
        const updatedClient = action.payload.client!;

        if (state.byId[updatedClient._id]) {
          state.byId[updatedClient._id] = {
            ...state.byId[updatedClient._id],
            ...updatedClient,
          };
        }

        state.updateLoading = false;
      })
      .addCase(updateClientData.rejected, (state) => {
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
      })
      .addCase(getClients.pending, (state) => {
        state.loading = true;
      })
      .addCase(getClients.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload);

        state.allIds = [...state.allIds, ...allIds];
        state.byId = { ...state.byId, ...byId };

        state.loading = false;
      })
      .addCase(getClients.rejected, (state) => {
        state.loading = false;
      })
      .addCase(searchClient.pending, (state) => {
        state.filterLoading = true;
      })
      .addCase(searchClient.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload);

        state.filterIds = allIds;
        state.filterById = byId;

        state.filterLoading = false;
      })
      .addCase(searchClient.rejected, (state, action) => {
        state.filterLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getClientById.pending, (state) => {
        state.filterLoading = true;
      })
      .addCase(getClientById.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload);

        if (!state.byId[action.payload?._id]) {
          state.allIds = [...state.allIds, ...allIds];
          state.byId = { ...state.byId, ...byId };
        }

        state.filterLoading = false;
      })
      .addCase(getClientById.rejected, (state, action) => {
        state.filterLoading = false;
        state.error = action.payload as string;
      }),
});

export const { resetClientFilter } = clientSlice.actions;
export default clientSlice.reducer;
