import client from './client';

export const getOrders = (params) => client.get('/orders', { params });

export const getOrderDetail = (id) => client.get('/orders/' + id).then(res => {
  const data = res.data || res;
  const order = data.order || data;
  const items = data.items;
  if (items) {
    return { ...order, items };
  }
  return order || data;
});

export const createOrder = (data) => client.post('/orders', data);

export const cancelOrder = (id) => client.post('/orders/' + id + '/cancel');

export const getOrderHistory = (params) => client.get('/orders/history', { params });

export const createInvoice = (id) => client.get('/orders/' + id + '/invoice');
