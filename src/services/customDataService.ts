import api from './api';

export interface CustomDataParams {
  tipo_dato: string;
  desde: string;
  hasta: string;
}

export interface CustomData {
  id?: number;
  tipo_dato: string;
  desde: string;
  hasta: string;
  empresa: string;
  valor: number;
}

export interface CustomDataUpdateRequest {
  id: number;
  tipo_dato: string;
  valor: number;
}

export const customDataService = {
  async consultar(params: CustomDataParams): Promise<CustomData[]> {
    try {
      const response = await api.post('/custom-data/consultar', params);
      return response.data;
    } catch (error: any) {
      console.error('Error en consulta de datos personalizados:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        params
      });
      
      if (error.response?.status === 404) {
        throw new Error('El servicio de datos personalizados no está disponible');
      } else if (error.response?.data?.detail) {
        throw new Error(`Error del servidor: ${error.response.data.detail}`);
      } else if (!error.response) {
        throw new Error('No se pudo conectar con el servidor. Verifique su conexión.');
      }
      throw error;
    }
  },

  async crear(data: CustomData): Promise<CustomData> {
    try {
      const response = await api.post('/custom-data', data);
      return response.data;
    } catch (error: any) {
      throw new Error('Error al crear el dato personalizado: ' + error.response?.data?.detail || error.message);
    }
  },

  async actualizar(data: CustomDataUpdateRequest): Promise<CustomData> {
    try {
      const response = await api.put('/custom-data', data);
      return response.data;
    } catch (error: any) {
      throw new Error('Error al actualizar el dato personalizado: ' + error.response?.data?.detail || error.message);
    }
  },

  async eliminar(id: number): Promise<void> {
    try {
      await api.delete(`/custom-data/${id}`);
    } catch (error: any) {
      throw new Error('Error al eliminar el dato personalizado: ' + error.response?.data?.detail || error.message);
    }
  }
};