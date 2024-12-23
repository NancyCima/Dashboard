import api from './api';

export interface CustomDataParams {
  desde: string;
  hasta: string;
}

export interface CustomDataResponse {
  id: number;
  tipo_dato: string;
  desde: string;
  hasta: string;
  empresa: string;
  valor: number;
}

export interface CreateCustomDataRequest {
  tipo_dato: string;
  desde: string;
  hasta: string;
  empresa: string;
  valor: number;
}

export interface UpdateCustomDataRequest {
  id: number;
  tipo_dato: string;
  valor: number;
}

export const customDataService = {
  async consultar(params: CustomDataParams): Promise<CustomDataResponse[]> {
    try {
      const response = await api.post('/custom-data/consultar', params);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('El servicio de datos personalizados no está disponible');
      }
      throw error;
    }
  },
  async crear(data: CreateCustomDataRequest): Promise<CustomDataResponse> {
    try {
      const response = await api.post('/custom-data', data);
      return response.data;
    } catch (error: any) {
      throw new Error('Error al crear el dato personalizado: ' + error.message);
    }
  },

  async actualizar(data: UpdateCustomDataRequest): Promise<CustomDataResponse> {
    try {
      const response = await api.put('/custom-data', data);
      return response.data;
    } catch (error: any) {
      throw new Error('Error al actualizar el dato personalizado: ' + error.message);
    }
  },

  async eliminar(id: number): Promise<void> {
    try {
      await api.delete(`/custom-data/${id}`);
    } catch (error: any) {
      throw new Error('Error al eliminar el dato personalizado: ' + error.message);
    }
  }
};