export interface NormalizeState<T> {
  byId: { [key: string]: T };
  allIds: string[];
  loading: Boolean;
  error: string | null;
}
