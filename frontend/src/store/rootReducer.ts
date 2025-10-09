import { combineReducers } from "@reduxjs/toolkit";
import clientReducer from "./slices/clientSlice";
import agentReducer from "./slices/agentSlice";
import landReducer from "./slices/landSlice";
import lotReducer from "./slices/lotSlice";
import appReducer from "./slices/applicationSlice";
import reservationReducer from "./slices/reservationSlice";
import contractReducer from "./slices/contractSlice";

const rootReducer = combineReducers({
  client: clientReducer,
  agent: agentReducer,
  land: landReducer,
  lot: lotReducer,
  application: appReducer,
  reservation: reservationReducer,
  contract: contractReducer,
});

export default rootReducer;
