export const formatNumber = (value: number | string): string => {
  if (value === null || value === undefined || value === "") return "";
  return Number(value).toLocaleString("en-US");
};
