import client from './client';

export const getSettings = () => client.get('/settings');

export const updateBusiness = (data) => client.post('/settings/business', data);

export const updatePricing = (data) => client.post('/settings/pricing', data);

export const updateHours = (data) => client.post('/settings/hours', data);

export const updateLoyalty = (data) => client.post('/settings/loyalty', data);

export const updateMedia = (data) => client.post('/settings/media', data);

export const getUsers = () => client.get('/settings/users');

export const createUser = (data) => client.post('/settings/users', data);

export const deleteUser = (id) => client.delete('/settings/users/' + id);

export const changePassword = (data) => client.post('/settings/password', data);

export const backupData = () => client.post('/settings/backup');

export const getBackups = () => client.get('/settings/backups');

export const downloadBackup = (filename) => `/backups/${filename}`;
