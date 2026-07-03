import client from './client';

export const getInventory = () => client.get('/inventory');

export const adjustStock = (id, data) => client.post('/inventory/' + id + '/adjust', data);

export const getPurchases = (params) => client.get('/purchases', { params });

export const createPurchase = (data) => client.post('/purchases', data);

export const updatePurchase = (id, data) => client.put('/purchases/' + id, data);

export const deletePurchase = (id) => client.delete('/purchases/' + id);

export const getPurchaseDetail = (id) => client.get('/purchases/' + id);

export const getSuppliers = () => client.get('/suppliers');

export const createSupplier = (data) => client.post('/suppliers', data);

export const updateSupplier = (id, data) => client.put('/suppliers/' + id, data);

export const deleteSupplier = (id) => client.delete('/suppliers/' + id);
