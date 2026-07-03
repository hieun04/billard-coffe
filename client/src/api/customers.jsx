import client from './client';

export const getCustomers = (params) => client.get('/customers', { params });

export const searchCustomers = (query) => client.get('/customers/search', { params: { q: query } });

export const getCustomer = (id) => client.get('/customers/' + id);

export const createCustomer = (data) => client.post('/customers', data);

export const addPoints = (id, data) => client.post('/customers/' + id + '/add-points', data);

export const deleteCustomer = (id) => client.delete('/customers/' + id);

export const updateCustomer = (id, data) => client.put('/customers/' + id, data);
