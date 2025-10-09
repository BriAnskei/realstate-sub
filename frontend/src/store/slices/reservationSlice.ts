import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NormalizeState } from "../../types/TypesHelper";
import { normalizeResponse } from "../../utils/normalizeResponse";
import { ReservationApi } from "../../utils/api/reservationApi";
import {
  addReserveApplication,
  ApplicationType,
  setApplicaitonStatus,
} from "./applicationSlice";
import { markLotsStatus } from "./lotSlice";
import { markSoldLots } from "./landSlice";

export const manualAddReservation = createAsyncThunk(
  "reservation/add",
  async (
    payload: { reservation: ReserveType; application: ApplicationType },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const res = await ReservationApi.createReservation(payload);
      console.log("resL: ", res);

      if (!res.success) {
        return rejectWithValue(res.message || "Reservation creation failed");
      }

      const { application } = res;
      dispatch(addReserveApplication(application));
      dispatch(
        markLotsStatus({ lotsIds: application.lotIds, status: "reserved" })
      );

      return res;
    } catch (error) {
      return rejectWithValue("Error in manualAddReservation: " + error);
    }
  }
);

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

export const filterReservation = createAsyncThunk(
  "reservation/filter",
  async (
    payload: { searchQuery?: string; status?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await ReservationApi.getFilter(payload);
      console.log(res);
      return res.reservation;
    } catch (error) {
      return rejectWithValue("Error in filterReservation" + error);
    }
  }
);

export const rejectReservation = createAsyncThunk(
  "reservation/reject",
  async (
    payload: {
      reservation: ReserveType;
      status: string;
      notes?: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const { reservation, status, notes } = payload;
      const res = await ReservationApi.rejectReservation(payload);

      console.log("recieved payload: ", payload, "res: ", res);

      if (!res.success) rejectWithValue(res.message!);

      const { application } = res;

      // update application status and notes?
      dispatch(
        setApplicaitonStatus({
          applicationId: reservation.applicationId,
          status,
          notes,
        })
      );

      // mark lots as available
      dispatch(
        markLotsStatus({ lotsIds: application.lotIds, status: "available" })
      );

      // redo sold lots in landd
      dispatch(
        markSoldLots({
          landId: application.landId,
          totalSoldLots: application.lotIds?.length,
        })
      );

      return { reservationId: payload.reservation._id, status };
    } catch (error) {
      return rejectWithValue("Error in rejectReservation" + error);
    }
  }
);

export type statusType = "pending" | "cancelled" | "on contract" | "no show";

export interface ReserveType {
  _id: string;
  applicationId?: string;
  clientName?: string;
  status?: statusType;
  notes?: string | null;
  appointmentDate?: string;
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
    clearReservationFilter: (state) => {
      state.filterById = {};
      state.filterIds = [];
    },
    updateReservationStatus: (state, action) => {
      const { reservationId, status } = action.payload;

      if (state.byId[reservationId]) {
        state.byId[reservationId] = { ...state.byId[reservationId], status };
      }
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
      })

      .addCase(filterReservation.pending, (state) => {
        state.filterLoading = true;
      })
      .addCase(filterReservation.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload!);

        state.filterById = byId;
        state.filterIds = allIds;

        state.filterLoading = false;
      })
      .addCase(filterReservation.rejected, (state, action) => {
        state.error = action.payload as string;
        state.filterLoading = false;
      })
      .addCase(manualAddReservation.pending, (state) => {
        state.loading = true;
      })
      .addCase(manualAddReservation.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(
          action.payload?.reservation!
        );

        state.byId = { ...state.byId, ...byId };
        state.allIds = [...allIds, ...state.allIds];

        state.loading = false;
      })
      .addCase(manualAddReservation.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(rejectReservation.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectReservation.fulfilled, (state, action) => {
        const { reservationId, status } = action.payload;

        if (state.byId[reservationId]) {
          state.byId[reservationId] = {
            ...state.byId[reservationId],
            status: status as statusType,
          };
        }

        state.loading = false;
      })
      .addCase(rejectReservation.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const {
  addNewResersation,
  clearReservationFilter,
  updateReservationStatus,
} = reservationSlice.actions;
export default reservationSlice.reducer;
