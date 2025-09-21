import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NormalizeState } from "../../types/TypesHelper";
import { normalizeResponse } from "../../utils/normalizeResponse";
import { LotApi } from "../../utils/api/lotApi";

export interface LotType {
  _id: string;
  name?: string; // land name
  LandId?: string;
  blockNumber?: string;
  lotNumber?: string;
  lotSize?: string;
  pricePerSqm?: string;
  totalAmount?: string;
  lotType?: string;
  lotStatus?: string;
  createdAt?: string;
}

interface LotState extends NormalizeState<LotType> {
  updateLoading: boolean;
}

const initialState: LotState = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
  updateLoading: false,
};

const lotApi = new LotApi();

export const fetchLots = createAsyncThunk(
  "lot/fetch",
  async (data: { cursor?: string }, { rejectWithValue }) => {
    try {
      console.log("fetching lots:");

      const res = await lotApi.getLots();
      console.log("fetch reponmse: ", res);
      return res.lots;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const editLot = createAsyncThunk(
  "lot/edit",
  async (
    { id, newData }: { id: string; newData: LotType },
    { rejectWithValue }
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return { id, newData };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteLot = createAsyncThunk(
  "lot/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const lotSclice = createSlice({
  name: "lot",
  initialState,
  reducers: {
    bulkSaveLots: (state, action) => {
      const { allIds, byId } = normalizeResponse(action.payload);

      state.allIds = [...state.allIds, ...allIds];
      state.byId = { ...state.byId, ...byId };
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchLots.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(fetchLots.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload);

        console.log("allIDs", allIds);

        state.allIds = [...state.allIds, ...allIds];
        state.byId = { ...state.byId, ...byId };

        state.updateLoading = false;
      })
      .addCase(fetchLots.rejected, (state) => {
        state.updateLoading = false;
      })

      .addCase(editLot.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(editLot.fulfilled, (state, action) => {
        if (state.byId[action.payload.id]) {
          state.byId[action.payload.id] = action.payload.newData;
        }

        state.updateLoading = false;
      })
      .addCase(editLot.rejected, (state) => {
        state.updateLoading = false;
      })

      .addCase(deleteLot.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(deleteLot.fulfilled, (state, action) => {
        state.allIds = state.allIds.filter((id) => id !== action.payload);
        delete state.byId[action.payload];

        state.updateLoading = false;
      })
      .addCase(deleteLot.rejected, (state) => {
        state.updateLoading = false;
      });
  },
});

export const { bulkSaveLots } = lotSclice.actions;
export default lotSclice.reducer;
