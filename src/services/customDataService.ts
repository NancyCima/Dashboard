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
      // Modificamos la consulta para filtrar exactamente por el período
      const response = await api.post('/custom-data/consultar', {
        ...params,
        exact_match: true // Agregamos un flag para indicar que queremos coincidencia exacta
      });
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
      const response = await api.post('/custom-data', {
        ...data,
        periodo: data.desde.substring(0, 7) // Agregamos el período como YYYY-MM
      });
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
  }
};