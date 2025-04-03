import api from './api';

export const getWatchlists = async () => {
  try {
    const response = await api.get('/watchlist');
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Failed to fetch watchlists' };
  }
};

export const createWatchlist = async (name) => {
  try {
    const response = await api.post('/watchlist', { name });
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Failed to create watchlist' };
  }
};

export const addStockToWatchlist = async (watchlistId, symbol, name) => {
  try {
    const response = await api.post(`/watchlist/${watchlistId}/add`, { symbol, name });
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Failed to add stock to watchlist' };
  }
};

export const removeStockFromWatchlist = async (watchlistId, symbol) => {
  try {
    const response = await api.delete(`/watchlist/${watchlistId}/remove/${symbol}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Failed to remove stock from watchlist' };
  }
};

export const deleteWatchlist = async (watchlistId) => {
  try {
    const response = await api.delete(`/watchlist/${watchlistId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Failed to delete watchlist' };
  }
};