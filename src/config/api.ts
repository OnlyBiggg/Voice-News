import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
class ApiService {
  private api: AxiosInstance;

  constructor(baseURL: string) {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Optional: Uncomment if you want to include authorization tokens in the request
    this.api.interceptors.request.use(
      config => {
        const token = AsyncStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.api.post<T>(url, data, config);
  }

  get<T>(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.api.get<T>(url, config);
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.api.put<T>(url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.api.delete<T>(url, config);
  }
}
const BASE_URL = 'https://8e23-42-118-54-104.ngrok-free.app/api'
const apiService = new ApiService(BASE_URL); 

export default apiService;
