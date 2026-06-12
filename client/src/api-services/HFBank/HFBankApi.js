import axiosInstance from "../../config/axios";

export const createHFBank = async (data) => {
  const response = await axiosInstance.post("/first-bank", data);
  return response.data;
};

export const AllHFBank = async () => {
  const response = await axiosInstance.get("/first-bank");
  return response.data;
};

export const GetHFBankById = async (id) => {
  const response = await axiosInstance.get(`/first-bank/${id}`);
  return response.data;
};

export const UpdateHFBankById = async (id, data) => {
  const response = await axiosInstance.put(`/first-bank/${id}`, data);
  return response.data;
};
