import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { selectClientById } from "../../store/selector/clientSelector";
import { ClientType } from "../../store/slices/clientSlice";

export const useClientById = (clientId?: string) => {
  if (!clientId) return;

  const clientData: ClientType = useSelector((state: RootState) =>
    selectClientById(state, clientId)
  );
  return clientData;
};
