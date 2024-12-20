export interface Row {
  id: string | number;
  fecha: string;
  comprobante: string;
  condicion_iva: string;
  razon_social: string;
  cuit: string;
  importe: number;
  importe_total: number;
}

export interface Empresa {
  nombre: string;
  cuit: string;
  proviene: string;
}