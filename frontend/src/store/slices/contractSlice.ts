import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NormalizeState } from "../../types/TypesHelper";
import { normalizeResponse } from "../../utils/normalizeResponse";
import { ContractApi } from "../../utils/api/contractApi";
import { updateReservationStatus } from "./reservationSlice";
import { markLotsStatus } from "./lotSlice";

export interface ContractType {
  _id: string;
  clientId?: string;
  agentsIds: number[];
  applicationId?: string;
  contractPDF?: string;
  term?: string;
  createdAt?: string;
}

interface ContractState extends NormalizeState<ContractType> {
  loading: boolean;
  updateLoading: boolean;
  fetchingLoading: boolean;
  filterLoading: boolean;
  error: string | null;
  selectedContract?: ContractType;
  filteredContracts: ContractType[];
}

const initialState: ContractState = {
  byId: {},
  allIds: [],
  loading: false,
  updateLoading: false,
  fetchingLoading: false,
  filterLoading: false,
  error: null,
  filteredContracts: [],
};

const contractApi = new ContractApi();

/**
 * Fetch all contracts
 */
export const fetchAllContracts = createAsyncThunk(
  "contract/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await contractApi.fetchAllContracts();
      return res.contracts;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Add a new contract
 */
export const addContract = createAsyncThunk(
  "contract/add",
  async (payload: Partial<ContractType>, { rejectWithValue, dispatch }) => {
    try {
      console.log("Addding newe contract: ", payload);
      const res = await contractApi.addContract(payload);

      const reservationId = res.reservation._id;

      console.log(reservationId, res.reservation._id, res.reservation);

      dispatch(
        updateReservationStatus({ reservationId, status: "on contract" })
      );

      const lotsIds = res.application.lotIds;
      dispatch(markLotsStatus({ lotsIds, status: "sold" }));

      return res.contract;
    } catch (error) {
      return rejectWithValue("Error in  addContract" + error);
    }
  }
);

/**
 * Fetch contracts by agent ID
 */
export const fetchContractsByAgentId = createAsyncThunk(
  "contract/fetchByAgent",
  async (agentId: string, { rejectWithValue }) => {
    try {
      const res = await contractApi.fetchContractsByAgentId(agentId);
      return res.contracts;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Get single contract by ID
 */
export const getContractById = createAsyncThunk(
  "contract/getById",
  async (_id: string, { rejectWithValue }) => {
    try {
      const res = await contractApi.getContractById(_id);
      return res.contract;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * Slice
 */
const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    resetContractState: (state) => {
      state.byId = {};
      state.allIds = [];
      state.filteredContracts = [];
      state.error = null;
    },
    resetSelectedContract: (state) => {
      state.selectedContract = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllContracts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllContracts.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload);
        state.byId = byId;
        state.allIds = allIds;
        state.loading = false;
      })
      .addCase(fetchAllContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add
      .addCase(addContract.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(addContract.fulfilled, (state, action) => {
        const newContract = action.payload;
        state.byId[newContract._id] = newContract;
        state.allIds.unshift(newContract._id);
        state.updateLoading = false;
      })
      .addCase(addContract.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload as string;
      })

      // Fetch by agent
      .addCase(fetchContractsByAgentId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContractsByAgentId.fulfilled, (state, action) => {
        const { allIds, byId } = normalizeResponse(action.payload);
        state.byId = byId;
        state.allIds = allIds;
        state.loading = false;
      })
      .addCase(fetchContractsByAgentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get by ID
      .addCase(getContractById.pending, (state) => {
        state.fetchingLoading = true;
      })
      .addCase(getContractById.fulfilled, (state, action) => {
        const contract = action.payload;
        state.selectedContract = contract;
        state.byId[contract._id] = contract;
        if (!state.allIds.includes(contract._id)) {
          state.allIds.push(contract._id);
        }
        state.fetchingLoading = false;
      })
      .addCase(getContractById.rejected, (state, action) => {
        state.fetchingLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetContractState, resetSelectedContract } =
  contractSlice.actions;
export default contractSlice.reducer;
