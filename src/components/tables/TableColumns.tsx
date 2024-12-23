import { Company } from '@/types/company';

export const generateTableColumns = (companies: Company[]) => {
  return [
    { id: 'concepto', label: 'Conceptos', width: 200 },
    ...companies.map(company => ({
      id: company.nombre.toLowerCase().replace(/\s+/g, '_'),
      label: company.nombre,
      width: 150,
      align: 'right' as const
    })),
    { id: 'total', label: 'Totales', width: 150, align: 'right' as const }
  ];
};