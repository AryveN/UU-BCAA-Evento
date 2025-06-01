import axios from 'axios';
const api = axios.create({ baseURL: '/api' });

// Events
export const listEvents   = (filters) => api.post('/event/list', filters);
export const createEvent  = (data)    => api.post('/event/create', data);
export const getEvent     = (id)      => api.post('/event/get', { id });
export const updateEvent  = (data)    => api.put(`/event/${data.id}`, data);

// Guests
export const listGuests   = (eventId) => api.post('/event/listGuests', { id: eventId });
export const addGuest     = (eventId, email) => api.post('/event/addGuest', { id: eventId, email });

// Expenses
export const listExpenses  = (eventId) => api.post('/expense/list', { eventId });
export const createExpense = (data)    => api.post('/expense/create', data);
export const updateExpense = (data)    => api.put('/expense/update', data);
export const deleteExpense = (id)      => api.delete('/expense/remove', { data: { id } });
export const getExpense    = (id)      => api.post('/expense/get', { id });

export default api;