import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NormalizeState } from "../../types/TypesHelper";
import { normalizeResponse } from "../../utils/normalizeResponse";
import { ReservationApi } from "../../utils/api/reservationApi";

export const fetchAllReservaton = createAsyncThunk(
  "reservation/fetchAll",
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await ReservationApi.getAllReservations();

      return response.reservations;
    } catch (error) {
      rejectWithValue("Failed to fetchAllReservaton, " + error);
    }
  }
);

export interface ReserveType {
  _id: string;
  applicationId?: string;
  clientName?: string;
  status?: "pending" | "cancelled" | "on contract" | "no show";
  notes?: string | null;
  createdAt?: string;
}

interface ReservationState extends NormalizeState<ReserveType> {
  updateLoading: boolean;
  filterById: { [key: string]: ReserveType };
  filterIds: string[];
  filterLoading: boolean;
}

const initialState: ReservationState = {
  byId: {},
  allIds: [],
  error: null,
  loading: false,
  updateLoading: false,
  filterLoading: false,
  filterById: {},
  filterIds: [],
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    addNewResersation: (state, action) => {
      const { allIds, byId } = normalizeResponse(action.payload);
      state.byId = { ...state.byId, ...byId };
      state.allIds = [allIds[0], ...state.allIds];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReservaton.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllReservaton.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload!);

        console.log("fetched in action:L ", allIds, byId);

        state.byId = { ...state.byId, ...byId };
        state.allIds = [...allIds, ...state.allIds];

        state.loading = false;
      })
      .addCase(fetchAllReservaton.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { addNewResersation } = reservationSlice.actions;
export default reservationSlice.reducer;
