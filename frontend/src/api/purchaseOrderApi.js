import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/purchase-orders`;

export const createPurchaseOrder = async (data) => {
    const response = await axios.post(`${API_URL}/create`, data);
    return response.data;
};

export const getPurchaseOrders = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getPurchaseOrderById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const approvePurchaseOrder = async (id, userId) => {
    const response = await axios.put(`${API_URL}/approve/${id}`, {
        userId
    });

    return response.data;
};

export const rejectPurchaseOrder = async (id, userId) => {
    const response = await axios.put(`${API_URL}/reject/${id}`, {
        userId
    });

    return response.data;
};