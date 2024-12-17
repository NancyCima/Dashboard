import { formatCurrency, formatDate } from '@/utils/formatters';
import { Column } from '@/components/tables/DataTable';

export const retencionesColumns: Column[] = [
  { id: 'fecha', label: 'Fecha', format: formatDate },
  { id: 'comprobante', label: 'Nro de Comprobante' },
  { id: 'condicion_iva', label: 'Condición IVA' },
  { id: 'razon_social', label: 'Razón Social' },
  { id: 'cuit', label: 'CUIT' },
  { id: 'importe', label: 'Importe', align: 'right', format: formatCurrency },
  { id: 'importe_total', label: 'Importe Total', align: 'right', format: formatCurrency },
];