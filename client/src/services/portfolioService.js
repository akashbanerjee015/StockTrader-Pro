import api from './api';

export const getPortfolio = async () => {
  try {
    const response = await api.get('/portfolio');
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Failed to fetch portfolio' };
  }
};

export const getTransactions = async () => {
  try {
    const response = await api.get('/portfolio/transactions');
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Failed to fetch transactions' };
  }
};

export const buyStock = async (stockData) => {
  try {
    const response = await api.post('/portfolio/buy', stockData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Failed to buy stock' };
  }
};

export const sellStock = async (stockData) => {
  try {
    const response = await api.post('/portfolio/sell', stockData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Failed to sell stock' };
  }
};