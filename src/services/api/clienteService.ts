import api from './api';
import { API_ENDPOINTS } from './endpoints';
import {
  IvaParams,
  RetencionesPercepcionesParams,
  IvaResponse,
  Empresa,
  SubdiarioIvaParams
} from '../types';

class ClienteService {
  async getEmpresas(): Promise<Empresa[]> {
    const response = await api.get(API_ENDPOINTS.EMPRESAS);
    return response.data.data;
  }

  async getIvaComprasContabilium(params: IvaParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(API_ENDPOINTS.IVA_COMPRAS, params);
      return response.data;
    } catch (error) {
      console.error('Error al obtener IVA compras:', error);
      throw error;
    }
  }

  async getIvaVentasContabilium(params: IvaParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(API_ENDPOINTS.IVA_VENTAS, params);
      return response.data;
    } catch (error) {
      console.error('Error al obtener IVA ventas:', error);
      throw error;
    }
  }

  async getSubdiarioIvaVentas(params: SubdiarioIvaParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(API_ENDPOINTS.SUBDIARIO_IVA_VENTAS, params);
      return response.data;
    } catch (error) {
      console.error('Error al obtener subdiario IVA ventas:', error);
      throw error;
    }
  }

  async getSubdiarioIvaCompras(params: SubdiarioIvaParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(API_ENDPOINTS.SUBDIARIO_IVA_COMPRAS, params);
      return response.data;
    } catch (error) {
      console.error('Error al obtener subdiario IVA compras:', error);
      throw error;
    }
  }

  async getRetenciones(params: RetencionesPercepcionesParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(API_ENDPOINTS.RETENCIONES, params);
      return response.data;
    } catch (error) {
      console.error('Error al obtener retenciones:', error);
      throw error;
    }
  }

  async getPerceptions(params: RetencionesPercepcionesParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(API_ENDPOINTS.PERCEPCIONES, params);
      return response.data;
    } catch (error) {
      console.error('Error al obtener percepciones:', error);
      throw error;
    }
  }

  async getPerceptionsArba(params: RetencionesPercepcionesParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(API_ENDPOINTS.PERCEPCIONES_ARBA, params);
      return response.data;
    } catch (error) {
      console.error('Error al obtener percepciones ARBA:', error);
      throw error;
    }
  }

  async getPerceptionsAgip(params: RetencionesPercepcionesParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(API_ENDPOINTS.PERCEPCIONES_AGIP, params);
      return response.data;
    } catch (error) {
      console.error('Error al obtener percepciones AGIP:', error);
      throw error;
    }
  }
}

export default new ClienteService();