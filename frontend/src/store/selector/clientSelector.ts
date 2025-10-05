import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

const byId = (state: RootState) => state.client.byId;

export const selectClientById = createSelector(
  [byId, (_state: RootState, clientId: string) => clientId],
  (byId, clientId) => byId[clientId]
);
