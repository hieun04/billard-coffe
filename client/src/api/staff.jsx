import client from './client';

export const getShifts = (params) => client.get('/shifts', { params });

export const getActiveShifts = () => client.get('/shifts/active');

export const getMyActiveShift = () => client.get('/shifts/my-active');

export const getShiftStats = (params) => client.get('/shifts/stats', { params });

export const clockIn = (data) => client.post('/shifts/clock-in', data);

export const clockOut = (id) => client.post('/shifts/' + id + '/clock-out');

export const getStaff = () => client.get('/staff');

export const createStaff = (data) => client.post('/staff', data);

export const endStaff = (id) => client.post('/staff/' + id + '/end');
