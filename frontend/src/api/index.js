// src/api/index.js
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'x-api-key': import.meta.env.VITE_API_KEY
  }
});

export const getTechniques  = (status) => api.get('/techniques', { params: status ? { status } : {} }).then(r => r.data);
export const getTechnique   = (id)     => api.get(`/techniques/${id}`).then(r => r.data);
export const createTechnique= (data)   => api.post('/techniques', data).then(r => r.data);
export const updateTechnique= (id, d)  => api.put(`/techniques/${id}`, d).then(r => r.data);
export const deleteTechnique= (id)     => api.delete(`/techniques/${id}`).then(r => r.data);

export const getTrainingCount  = ()    => api.get('/training').then(r => r.data);
export const incrementTraining = ()    => api.post('/training').then(r => r.data);

export const getBelt  = ()             => api.get('/belt').then(r => r.data);
export const addBelt  = (belt, degree) => api.post('/belt', { belt, degree }).then(r => r.data);
