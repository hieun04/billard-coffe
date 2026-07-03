import client from './client';

export const getProducts = () => client.get('/products');

export const getProduct = (id) => client.get('/products/' + id);

export const createProduct = (data) => client.post('/products', data);

export const updateProduct = (id, data) => client.put('/products/' + id, data);

export const deleteProduct = (id) => client.delete('/products/' + id);

export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return client.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

export const getCategories = () => client.get('/categories');
