import { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import ClienteService from '@/services/clienteService';
import { Row, Empresa } from '../types';

export const usePercepciones = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<string>('');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await ClienteService.getEmpresas();
        setEmpresas(response);
      } catch (error) {
        console.error('Error al obtener empresas:', error);
        setError('Error al cargar las empresas');
      }
    };

    fetchEmpresas();
  }, []);

  const handleSearch = async (type: 'default' | 'arba' | 'agip' = 'default') => {
    if (!startDate || !endDate) {
      setError('Debe seleccionar ambas fechas');
      return;
    }

    if (!selectedEmpresa) {
      setError('Debe seleccionar una empresa');
      return;
    }

    const empresaSeleccionada = empresas.find(emp => emp.cuit === selectedEmpresa);
    if (!empresaSeleccionada) {
      setError('No se encontró la empresa seleccionada');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const params = {
        fecha_desde: startDate.format('YYYY-MM-DD'),
        fecha_hasta: endDate.format('YYYY-MM-DD'),
        cuit: empresaSeleccionada.cuit
      };

      let response;
      switch (type) {
        case 'arba':
          response = await ClienteService.getPerceptionsArba(params);
          break;
        case 'agip':
          response = await ClienteService.getPerceptionsAgip(params);
          break;
        default:
          response = await ClienteService.getPerceptions(params);
      }

      const responseData = response.data;
      const rowsWithIds = responseData.map((row: Row, index: number) => ({
        ...row,
        id: row.id || `perception-${type}-${index}`
      }));

      setRows(rowsWithIds);
      if (!responseData || responseData.length === 0) {
        setError('No se encontraron datos para los criterios seleccionados');
      } else {
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al obtener los datos');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    empresas,
    selectedEmpresa,
    startDate,
    endDate,
    rows,
    page,
    rowsPerPage,
    loading,
    error,
    success,
    setSelectedEmpresa,
    setStartDate,
    setEndDate,
    handleSearch,
    handleChangePage,
    handleChangeRowsPerPage,
  };
};