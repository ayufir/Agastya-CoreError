import axiosInstance from "../../config/axios";

// CREATE
export const createManappuram = async (data) => {
    const res = await axiosInstance.post("/manappuram", data);
    return res.data;
};

// GET ALL
export const getAllManappuram = async () => {
    const res = await axiosInstance.get("/manappuram");
    return res.data;
};

// GET BY ID
export const getManappuramById = async (id) => {
    const res = await axiosInstance.get(`/manappuram/${id}`);
    return res.data;
};

// UPDATE
export const updateManappuram = async (id, data) => {
    const res = await axiosInstance.put(`/manappuram/${id}`, data);
    return res.data;
};