import api from './api';

export const searchStocks = async (query) => {
  try {
    const response = await api.get(`/stocks/search/${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Failed to search stocks' };
  }
};

export const getStockDetails = async (symbol) => {
  try {
    const response = await api.get(`/stocks/${symbol}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Failed to fetch stock details' };
  }
};

export const getStockChart = async (symbol, period) => {
  try {
    const response = await api.get(`/stocks/${symbol}/chart/${period}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Failed to fetch stock chart data' };
  }
};

export const getStockNews = async (symbol) => {
  try {
    const response = await api.get(`/stocks/${symbol}/news`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { msg: 'Failed to fetch stock news' };
  }
};