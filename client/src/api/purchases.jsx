import client from './client';

export const getPurchases = (params) => client.get('/purchases', { params });
export const getPurchaseDetail = (id) => client.get('/purchases/' + id);

export const createPurchase = (data) => client.post('/purchases', data);

export const getSuppliers = () => client.get('/suppliers');
