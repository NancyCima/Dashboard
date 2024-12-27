// src/services/api/types.ts
export interface APIResponse<T> {
  status: string;
  message?: string;
  data: T;
}

export interface APIError {
  detail: string;
  code?: string;
}

// src/services/api/utils.ts
import { AxiosError } from 'axios';
import { APIError } from './types';

export const handleAPIError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as APIError;
    return apiError?.detail || 'Error de conexión con el servidor';
  }
  return 'Error inesperado';
};
