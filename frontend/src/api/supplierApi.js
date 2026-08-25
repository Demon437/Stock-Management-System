import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/supplier`;

export const addSupplier = async (supplierData) => {
    const response = await axios.post(`${API_URL}/add`, supplierData);
    return response.data;
};

export const getSuppliers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getSupplierById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const updateSupplier = async (id, supplierData) => {
    const response = await axios.put(`${API_URL}/${id}`, supplierData);
    return response.data;
};

export const deleteSupplier = async (id, userId) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        data: { userId }
    });
    return response.data;
};