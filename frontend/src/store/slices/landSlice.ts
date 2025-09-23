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
  filterById: { [key: string]: LandTypes };
  filterIds: string[];
  filterLoading: boolean;
}

const initialState: LandState = {
  byId: {},
  allIds: [],
  error: null,
  loading: false,
  updateLoading: false,
  filterLoading: false,
  filterById: {},
  filterIds: [],
};

const landApi = new LandApi();

// Fake API
const fakeApi = <T>(data: T, delay = 800): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

export const searchLand = createAsyncThunk(
  "land/search",
  async (landName: string, { rejectWithValue }) => {
    try {
      console.log("seaching land: ", landName);

      const res = await landApi.search(landName);
      return res.lands;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createLand = createAsyncThunk(
  "lands/create",
  async (
    payload: { land: LandTypes; lots: LotType[] },
    { dispatch, rejectWithValue }
  ) => {
    try {
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
        state.loading = true;
      })
      .addCase(createLand.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload);
        state.byId = { ...state.byId, ...byId };
        state.allIds.push(allIds[0]);
        state.loading = false;
      })
      .addCase(createLand.rejected, (state) => {
        state.loading = false;
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
      })
      .addCase(searchLand.pending, (state) => {
        state.filterLoading = true;
      })
      .addCase(searchLand.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload);

        state.filterById = byId;
        state.filterIds = allIds;

        state.filterLoading = false;
      })
      .addCase(searchLand.rejected, (state, action) => {
        state.error = action.payload as string;
        state.filterLoading = false;
      });
  },
});

export const { resetLands } = landSlice.actions;
export default landSlice.reducer;
