import axiosInstance from "../../config/axios";

// CREATE
export const createAdityaBirla = async (data) => {
    const res = await axiosInstance.post("/aditya-birla", data);
    return res.data;
};

// GET ALL
export const getAllAdityaBirla = async () => {
    const res = await axiosInstance.get("/aditya-birla");
    return res.data;
};

// GET BY ID
export const getAdityaBirlaById = async (id) => {
    const res = await axiosInstance.get(`/aditya-birla/${id}`);
    return res.data;
};

// UPDATE
export const updateAdityaBirla = async (id, data) => {
    const res = await axiosInstance.put(`/aditya-birla/${id}`, data);
    return res.data;
};