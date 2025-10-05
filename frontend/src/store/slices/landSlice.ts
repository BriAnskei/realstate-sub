import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { NormalizeState } from "../../types/TypesHelper";
import { normalizeResponse } from "../../utils/normalizeResponse"; // adjust path
import { bulkSaveLots, LotType, updateName } from "./lotSlice";
import { LandApi } from "../../utils/api/landApi";
import { RootState } from "../store";

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

export const createLand = createAsyncThunk(
  "lands/create",
  async (
    payload: { land: LandTypes; lots: LotType[] },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await landApi.addLand(payload);

      dispatch(bulkSaveLots({ landName: res.land.name, lots: res.lots }));

      return res.land;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getLandById = createAsyncThunk(
  "land/get-byid",
  async (landId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const byId = state.land.byId;

      // if land exist jusrt return it, no need to fetch
      if (byId[landId]) {
        return { success: true, land: byId[landId] as LandTypes };
      }

      const response = await landApi.findLandById(landId);

      if (!response.success) {
        return rejectWithValue(response.message ?? "Failed to find land");
      }

      return response;
    } catch (error) {
      return rejectWithValue("Failed to find Land:" + error);
    }
  }
);

export const searchLand = createAsyncThunk(
  "land/search",
  async (landName: string, { rejectWithValue }) => {
    try {
      const res = await landApi.search(landName);

      return res.lands;
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
  async (land: LandTypes, { rejectWithValue, dispatch }) => {
    try {
      await landApi.updateLand(parseInt(land._id, 10), land);

      dispatch(updateName({ landId: land._id, newName: land.name }));

      return land;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteLand = createAsyncThunk(
  "lands/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await landApi.deleteLand(parseInt(id, 10));
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Slice
const landSlice = createSlice({
  name: "lands",
  initialState,
  reducers: {
    resetLands: () => initialState,

    resetLandFilter: (state) => {
      state.filterById = {};
      state.filterIds = [];
    },

    decrementLotsCount: (state, action) => {
      // this function will be used for deletion
      const { status, landId } = action.payload;

      if (status === "reserved" || status === "sold") {
        const currCount = state.byId[landId].lotsSold;
        state.byId[landId].lotsSold! -= currCount ? 1 : 0;
      } else if (status === "available") {
        const currCount = state.byId[landId].available;
        state.byId[landId].available! -= currCount ? 1 : 0;
      }
    },
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
        const id = action.payload;
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
      })
      .addCase(getLandById.pending, (state) => {
        state.filterLoading = true;
      })
      .addCase(getLandById.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload.land);

        if (!state.byId[action.payload.land!._id]) {
          state.byId = { ...state.byId, ...byId };
          state.allIds = [...state.allIds, ...allIds[0]];
        }

        state.filterLoading = false;
      })
      .addCase(getLandById.rejected, (state, action) => {
        state.error = action.payload as string;
        state.filterLoading = false;
      });
  },
});

export const { resetLands, decrementLotsCount, resetLandFilter } =
  landSlice.actions;
export default landSlice.reducer;
