import React, { Dispatch, SetStateAction } from "react";

export const fileUploadHandler = <T>(
  callback: Dispatch<SetStateAction<T>>,
  field: keyof T
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      callback((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };
};
