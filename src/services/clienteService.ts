import api from './api';

interface IvaParams {
  fecha_desde: string;
  fecha_hasta: string;
  cuit?: string;
  empresa?: string;
}

interface RetencionesPercepcionesParams {
  fecha_desde: string;
  fecha_hasta: string;
  cuit?: string;
}

interface IvaResponse {
  data: any[];
}

interface Empresa {
  nombre: string;
  cuit: string;
  proviene: string;
}

interface SubdiarioIvaParams {
  fecha_desde: string;
  fecha_hasta: string;
  nombre_empresa: string;
}

class ClienteService {
  private readonly BASE_URL = '/cliente';

  async getEmpresas(): Promise<Empresa[]> {
    const response = await api.get(`${this.BASE_URL}/empresas`);
    return response.data.data;
  }

  async getIvaComprasContabilium(params: IvaParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(
        `${this.BASE_URL}/iva-compras`,
        params
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener IVA compras:', error);
      throw error;
    }
  }

  async getIvaVentasContabilium(params: IvaParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(
        `${this.BASE_URL}/iva-ventas`,
        params
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener IVA ventas:', error);
      throw error;
    }
  }

  async getSubdiarioIvaVentas(params: SubdiarioIvaParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(
        `${this.BASE_URL}/empresa/subdiario-iva-ventas`,
        params
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener subdiario IVA ventas:', error);
      throw error;
    }
  }

  async getSubdiarioIvaCompras(params: SubdiarioIvaParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(
        `${this.BASE_URL}/empresa/subdiario-iva-compras`,
        params
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener subdiario IVA compras:', error);
      throw error;
    }
  }

  async getRetenciones(params: RetencionesPercepcionesParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(
        `${this.BASE_URL}/iva-retenciones`,
        params
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener retenciones:', error);
      throw error;
    }
  }

  async getPerceptions(params: RetencionesPercepcionesParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(
        `${this.BASE_URL}/iva-percepciones`,
        params
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener percepciones:', error);
      throw error;
    }
  }

  async getPerceptionsArba(params: RetencionesPercepcionesParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(
        `${this.BASE_URL}/iva-percepciones-arba`,
        params
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener percepciones ARBA:', error);
      throw error;
    }
  }

  async getPerceptionsAgip(params: RetencionesPercepcionesParams): Promise<IvaResponse> {
    try {
      const response = await api.post<IvaResponse>(
        `${this.BASE_URL}/iva-percepciones-agip`,
        params
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener percepciones AGIP:', error);
      throw error;
    }
  }

  async getPercepcionesArbaVs(params: { fecha_desde: string; fecha_hasta: string; nombre_empresa: string }): Promise<any> {
    const response = await api.post('/vs/percepciones-arba', params);
    return response;
  }

  async getSubdiarioIvaVentasVs(params: { fecha_desde: string; fecha_hasta: string; nombre_empresa: string }): Promise<any> {
    const response = await api.post('/vs/subdiario-iva-ventas', params);
    return response;
  }

  async getSubdiarioIvaComprasVs(params: { fecha_desde: string; fecha_hasta: string; nombre_empresa: string }): Promise<any> {
    const response = await api.post('/vs/subdiario-iva-compras', params);
    return response;
  }

  async getRetencionesVentasVs(params: { fecha_desde: string; fecha_hasta: string; nombre_empresa: string }): Promise<any> {
    const response = await api.post('/vs/retenciones-ventas', params);
    return response;
  }

  async getConsultaUnificadaVs(params: { fecha_desde: string; fecha_hasta: string; nombre_empresa: string }): Promise<any> {
    const response = await api.post('/vs/consulta-unificada', params);
    return response;
  }
}

export default new ClienteService();