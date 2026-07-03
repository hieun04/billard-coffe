import client from './client';

export const getKPI = (params) => client.get('/reports/kpi', { params });

export const getRevenueReport = (params) => client.get('/reports/revenue', { params });

export const getProductReport = (params) => client.get('/reports/products', { params });

export const getStaffReport = (params) => client.get('/reports/staff', { params });

export const exportReport = (params) => client.get('/reports/export', { params, responseType: 'blob' });
