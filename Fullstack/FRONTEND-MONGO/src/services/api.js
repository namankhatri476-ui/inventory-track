import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Helper to map MongoDB _id to id for frontend use
const mapId = (item) => ({ ...item, id: item._id });

export const printerService = {
    // --- MODELS ---
    getModels: async () => {
        try {
            const res = await api.get('/models');
            return res.data.map(mapId);
        } catch (error) {
            console.error("Error fetching models:", error);
            return [];
        }
    },
    addModel: async (modelData) => {
        const res = await api.post('/models', modelData);
        return mapId(res.data);
    },

    // --- SERIALS ---
    getSerials: async () => {
        try {
            const res = await api.get('/serials');
            return res.data.map(mapId);
        } catch (error) {
            return [];
        }
    },
    addSerial: async (serialData) => {
        const res = await api.post('/serials', serialData);
        return mapId(res.data);
    },

    // --- DISPATCHES ---
    getDispatches: async () => {
        try {
            const res = await api.get('/dispatches');
            return res.data.map(mapId);
        } catch (error) {
            return [];
        }
    },
    addDispatch: async (dispatchData) => {
        const res = await api.post('/dispatches', dispatchData);
        return mapId(res.data);
    }
};