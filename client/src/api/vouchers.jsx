import client from './client';

export const getVouchers = () => client.get('/vouchers');

export const getEligibleVouchers = ({ subtotal, customer_id } = {}) =>
  client.get('/vouchers/eligible', { params: { subtotal, customer_id } });

export const validateVoucherCode = ({ code, subtotal, customer_id }) =>
  client.post('/vouchers/validate', { code, subtotal, customer_id });

export const createVoucher = (data) => client.post('/vouchers', data);

export const toggleVoucher = (id) => client.post('/vouchers/' + id + '/toggle');

export const deleteVoucher = (id) => client.delete('/vouchers/' + id);
