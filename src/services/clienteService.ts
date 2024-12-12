import api from './api';

interface IvaParams {
  fecha_desde: string;
  fecha_hasta: string;
  cuit?: string;
}

interface IvaResponse {
  // Aquí puedes definir la estructura de la respuesta
  // cuando tengas el formato exacto que devuelve el backend
  [key: string]: any;
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
}

export default new ClienteService();
