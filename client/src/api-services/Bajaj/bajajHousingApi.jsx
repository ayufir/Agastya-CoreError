// ============================================================
// FILE: api-services/bajajHousingApi.js  — CREATE THIS FILE
// ============================================================
import axiosInstance from "../../config/axios";

const BASE = "/bajaj-housing";

export const createBajajHousingApi = (data) => axiosInstance.post(BASE, data);
export const getAllBajajHousingApi = () => axiosInstance.get(BASE);
export const getBajajHousingByIdApi = (id) => axiosInstance.get(`${BASE}/${id}`);
export const updateBajajHousingApi = (id, data) => axiosInstance.put(`${BASE}/${id}`, data);
