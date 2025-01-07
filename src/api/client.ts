import axios from 'axios'; 

// Создаем базовую конфигурацию для Axios
export const axiosClient = axios.create({
  baseURL: 'http://localhost:5087/api',  // Ваш базовый URL
  headers: {
    'Content-Type': 'application/json',  // Устанавливаем заголовки, если нужно
  },
  timeout: 10000,  // Время ожидания (в миллисекундах)
});