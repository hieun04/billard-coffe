import client from './client';

export const getBookings = (params) => client.get('/bookings', { params });

export const getSchedule = (days = 7) => client.get('/bookings/schedule', { params: { days } });

export const getUpcomingBookings = (hours = 6) => client.get('/bookings/upcoming', { params: { hours } });

export const createBooking = (data) => client.post('/bookings', data);

export const confirmBooking = (id) => client.post('/bookings/' + id + '/confirm');

export const cancelBooking = (id) => client.post('/bookings/' + id + '/cancel');

export const startFromBooking = (id) => client.post('/bookings/' + id + '/start');

export const holdBooking = (id) => client.post('/bookings/' + id + '/hold');

export const updateBooking = (id, data) => client.put('/bookings/' + id, data);

export const deleteBooking = (id) => client.delete('/bookings/' + id);
