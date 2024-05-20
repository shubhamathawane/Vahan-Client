import axios from "axios";

const API_URL = "http://localhost:3001/api";

export const createEntity = async (entityData) => {
  const response = await axios.post(`${API_URL}/entities`, entityData);
  return response.data;
};

export const getEntity = async (entityData) => {
  const response = await axios.get(`${API_URL}/entities`);
  return response;
};

export const createRecord = async (entity, recordData) => {
  const response = await axios.post(`${API_URL}/${entity}`, recordData);
  return response;
};

export const fetchRecords = async (entity) => {
  const response = await axios.get(`${API_URL}/${entity}`);
  return response;
};

export const updateRecord = async (entity, id, updates) => {
  const response = await axios.put(`${API_URL}/${entity}/${id}`, updates);
  return response;
};

export const deleteRecord = async (entity, id) => {
  const response = await axios.delete(`${API_URL}/${entity}/${id}`);
  return response;
};

// New function to fetch entity attributes
export const fetchEntityAttributes = async (entity) => {
  const response = await axios.get(`${API_URL}/entities/${entity}/attributes`);
  return response;
};
