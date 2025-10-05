import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NormalizeState } from "../../types/TypesHelper";
import { normalizeResponse } from "../../utils/normalizeResponse";
import { LotApi } from "../../utils/api/lotApi";
import { decrementLotsCount } from "./landSlice";

export interface LotType {
  _id: string;
  name?: string; // land name
  landId?: string;
  blockNumber?: string;
  lotNumber?: string;
  lotSize?: string;
  pricePerSqm?: string;
  totalAmount?: string;
  lotType?: string;
  status?: string;
  createdAt?: string;
}

interface LotState extends NormalizeState<LotType> {
  updateLoading: boolean;
  fetchingMoreLoading: boolean;
  filterById: { [key: string]: LotType };
  allFilterIds: string[];
  filterLoading: boolean;

  // shows in lot modal (application info)
  fetchedLots: LotType[];
  fetchingLoading: boolean;
}

const initialState: LotState = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
  updateLoading: false,
  fetchingMoreLoading: false,
  filterLoading: false,
  filterById: {},
  allFilterIds: [],

  fetchedLots: [],
  fetchingLoading: false,
};

const lotApi = new LotApi();

export const fetchLots = createAsyncThunk(
  "lot/fetch",
  async (payload: { cursor?: string; limit?: number }, { rejectWithValue }) => {
    try {
      const res = await lotApi.getLots(payload);

      return res.lots;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const searchLotOnLandName = createAsyncThunk(
  "lot/search",
  async (
    payload: { landName: string; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await lotApi.searchLotsByLandName(payload);

      return res.lots;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getLotsByLandId = createAsyncThunk(
  "lot/getByLandId",
  async (landId: string, { rejectWithValue }) => {
    try {
      const res = await lotApi.findLotsByLandId(landId);

      return res.lots;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getLotsByIds = createAsyncThunk(
  "lot/getLotsByIds",
  async (lotIds: number[], { rejectWithValue }) => {
    try {
      const response = await lotApi.getLotsByIds(lotIds);
      return response.lots;
    } catch (error) {
      return rejectWithValue("Failed to dinf lots: " + error);
    }
  }
);
export const updateLot = createAsyncThunk(
  "lot/edit",
  async (
    { id, newData }: { id: string; newData: LotType },
    { rejectWithValue }
  ) => {
    try {
      await lotApi.updateLot(parseInt(id, 10), newData);
      return newData;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteLot = createAsyncThunk(
  "lot/delete",
  async (lotData: LotType, { rejectWithValue, dispatch }) => {
    try {
      const { _id, landId, status } = lotData;

      await lotApi.deleteLot(parseInt(_id, 10));
      dispatch(decrementLotsCount({ status, landId }));
      return _id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const lotSclice = createSlice({
  name: "lot",
  initialState,
  reducers: {
    updateName: (state, action) => {
      const { landId, newName } = action.payload;
      const allIds = state.allIds;
      const byId = state.byId;
      for (let id of allIds) {
        if (byId[id].landId === landId) {
          state.byId[id] = { ...state.byId[id], name: newName };
        }
      }
    },
    bulkSaveLots: (state, action) => {
      const { landName, lots } = action.payload;

      for (let i = 0; i < lots.length; i++)
        lots[i] = { ...lots[i], name: landName };

      const { allIds, byId } = normalizeResponse(lots);

      state.allIds = [...allIds, ...state.allIds];
      state.byId = { ...state.byId, ...byId };
    },
    resetFilter: (state) => {
      state.allFilterIds = [];
      state.filterById = {};
    },
    resetFetchedLots: (state) => {
      state.allFilterIds = [];
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchLots.pending, (state, action) => {
        if (action.meta.arg.cursor) {
          state.fetchingMoreLoading = true;
        } else {
          state.loading = true;
        }
      })
      .addCase(fetchLots.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload);

        state.allIds = [...state.allIds, ...allIds];
        state.byId = { ...state.byId, ...byId };

        state.fetchingMoreLoading = false;
        state.loading = false;
      })
      .addCase(fetchLots.rejected, (state) => {
        state.fetchingMoreLoading = false;
        state.loading = false;
      })

      .addCase(updateLot.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateLot.fulfilled, (state, action) => {
        if (state.byId[action.payload._id]) {
          state.byId[action.payload._id] = action.payload;
        }

        state.updateLoading = false;
      })
      .addCase(updateLot.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteLot.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(deleteLot.fulfilled, (state, action) => {
        const lotId = action.payload;

        state.allIds = state.allIds.filter((id) => id !== lotId);
        delete state.byId[lotId];

        if (state.filterById[lotId]) {
          delete state.filterById[lotId];
          state.allFilterIds = state.allFilterIds.filter((id) => id !== lotId);
        }

        state.updateLoading = false;
      })
      .addCase(deleteLot.rejected, (state) => {
        state.updateLoading = false;
      })
      .addCase(searchLotOnLandName.pending, (state) => {
        state.filterLoading = true;
      })
      .addCase(searchLotOnLandName.fulfilled, (state, action) => {
        const { byId, allIds } = normalizeResponse(action.payload);

        state.allFilterIds = allIds;
        state.filterById = byId;

        state.filterLoading = false;
      })
      .addCase(searchLotOnLandName.rejected, (state) => {
        state.filterLoading = false;
      })

      .addCase(getLotsByLandId.pending, (state) => {
        state.filterLoading = true;
      })
      .addCase(getLotsByLandId.fulfilled, (state, action) => {
        const { byId, allIds } = normalizeResponse(action.payload);

        state.allFilterIds = allIds;
        state.filterById = byId;

        state.filterLoading = false;
      })
      .addCase(getLotsByLandId.rejected, (state) => {
        state.filterLoading = false;
      })
      .addCase(getLotsByIds.pending, (state) => {
        state.fetchingLoading = true;
      })
      .addCase(getLotsByIds.fulfilled, (state, action) => {
        state.fetchedLots = action.payload;
        state.fetchingLoading = false;
      })
      .addCase(getLotsByIds.rejected, (state) => {
        state.fetchingLoading = false;
      });
  },
});

export const { bulkSaveLots, resetFilter, updateName, resetFetchedLots } =
  lotSclice.actions;
export default lotSclice.reducer;
