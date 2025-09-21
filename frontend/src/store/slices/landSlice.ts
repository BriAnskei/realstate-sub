import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { NormalizeState } from "../../types/TypesHelper";
import { normalizeResponse } from "../../utils/normalizeResponse"; // adjust path
import { bulkSaveLots, LotType } from "./lotSlice";
import { LandApi } from "../../utils/api/landApi";

export interface LandTypes {
  _id: string;
  name?: string;
  location?: string;
  totalArea?: number;
  totalLots?: number;
  available?: number;
  lotsSold?: number;
  createdAt?: string;
}

interface LandState extends NormalizeState<LandTypes> {
  updateLoading: boolean;
}

const initialState: LandState = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
  updateLoading: false,
};

const landApi = new LandApi();

// Fake API
const fakeApi = <T>(data: T, delay = 800): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

// Async thunks
export const createLand = createAsyncThunk(
  "lands/create",
  async (
    payload: { land: LandTypes; lots: LotType[] },
    { dispatch, rejectWithValue }
  ) => {
    try {
      console.log("payload slice: ", payload);

      const res = await landApi.addLand(payload);

      dispatch(bulkSaveLots(res.lots));

      return res.land;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchLands = createAsyncThunk(
  "lands/fetch",
  async (_: void, { rejectWithValue }) => {
    try {
      console.log("fething land: ");

      const res = await landApi.getLands();

      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateLand = createAsyncThunk(
  "lands/update",
  async (land: LandTypes) => {
    return await fakeApi(land);
  }
);

export const deleteLand = createAsyncThunk(
  "lands/delete",
  async (id: string) => {
    return await fakeApi({ _id: id });
  }
);

// Slice
const landSlice = createSlice({
  name: "lands",
  initialState,
  reducers: {
    resetLands: () => initialState,
  },
  extraReducers: (builder) => {
    // CREATE
    builder
      .addCase(createLand.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(createLand.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload);
        state.byId = { ...state.byId, ...byId };
        state.allIds.push(allIds[0]);
        state.updateLoading = false;
      })
      .addCase(createLand.rejected, (state) => {
        state.updateLoading = false;
      })
      .addCase(fetchLands.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLands.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload);

        state.byId = byId;
        state.allIds = allIds;
        state.loading = false;
      })
      .addCase(fetchLands.rejected, (state) => {
        state.loading = false;
      })

      .addCase(updateLand.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateLand.fulfilled, (state, action) => {
        state.byId[action.payload._id!] = { ...action.payload };
        state.updateLoading = false;
      })
      .addCase(updateLand.rejected, (state) => {
        state.updateLoading = false;
      })

      .addCase(deleteLand.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(deleteLand.fulfilled, (state, action) => {
        const id = action.payload._id;
        delete state.byId[id];
        state.allIds = state.allIds.filter((landId) => landId !== id);
        state.updateLoading = false;
      })
      .addCase(deleteLand.rejected, (state) => {
        state.updateLoading = false;
      });
  },
});

export const { resetLands } = landSlice.actions;
export default landSlice.reducer;
