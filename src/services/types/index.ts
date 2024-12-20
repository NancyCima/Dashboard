export interface IvaParams {
  fecha_desde: string;
  fecha_hasta: string;
  cuit?: string;
  empresa?: string;
}

export interface RetencionesPercepcionesParams {
  fecha_desde: string;
  fecha_hasta: string;
  cuit?: string;
}

export interface IvaResponse {
  data: any[];
}

export interface Empresa {
  nombre: string;
  cuit: string;
  proviene: string;
}

export interface SubdiarioIvaParams {
  fecha_desde: string;
  fecha_hasta: string;
  nombre_empresa: string;
}