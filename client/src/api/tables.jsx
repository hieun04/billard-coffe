import client from './client';

export const getTables = () => client.get('/tables');

export const getTable = (id) => client.get('/tables/' + id);

export const createTable = (data) => client.post('/tables', data);

export const startSession = (id, data) => client.post('/tables/' + id + '/start', data);

export const endSession = (id, data) => client.post('/tables/' + id + '/end', data || {});

export const reserveTable = (id, data) => client.post('/tables/' + id + '/reserve', data);

export const cancelReserve = (id) => client.post('/tables/' + id + '/cancel-reserve');

export const addDrinkToTable = (id, data) => client.post('/tables/' + id + '/add-drink', data);

export const addDrinksToTable = (id, items) => client.post('/tables/' + id + '/add-drinks', { items });

export const getPaymentPreview = (id) => client.get('/tables/' + id + '/payment-preview');

export const assignCustomer = (id, data) => client.post('/tables/' + id + '/assign-customer', data);

export const lookupCustomer = (query) => client.get('/tables/customer-lookup', { params: { q: query } });

export const deleteTable = (id) => client.delete('/tables/' + id);

export const checkInFromTable = (tableId) => client.post('/bookings/' + tableId + '/check-in');
