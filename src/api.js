import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://expense-backend-7t53.onrender.com',
});

export default instance;
