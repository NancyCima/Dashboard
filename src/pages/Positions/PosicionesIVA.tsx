import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper, Grid, Alert, CircularProgress } from '@mui/material';
import Title from '@/components/Title/Title';
import { IVATable } from './components/IVATable';
import { IVAData } from './types';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useCustomData } from './hooks/useCustomData';
import { MonthYearPicker } from '@/components/MonthYearPicker/MonthYearPicker';
import { resetIvaData, setIvaData } from '@/store/positions/actions';
import { RootState } from '@/store';
import dayjs, { Dayjs } from 'dayjs';

const PosicionesIVA = () => {
  const dispatch = useDispatch();
  const { mainData, deductionsData } = useSelector((state: RootState) => state.positions.iva);
  const [selectedPeriod, setSelectedPeriod] = useState<Dayjs | null>(dayjs());
  const { showSuccess, showError } = useSnackbar();
  const { fetchCustomData, loading, error } = useCustomData();

  useEffect(() => {
    dispatch(resetIvaData());
  }, [dispatch]);

  useEffect(() => {
    const updateDespachosCF = async () => {
      if (!selectedPeriod) return;

      const startOfMonth = selectedPeriod.startOf('month');
      const endOfMonth = selectedPeriod.endOf('month');

      try {
        const response = await fetchCustomData(
          startOfMonth.format('YYYY-MM-DD'),
          endOfMonth.format('YYYY-MM-DD')
        );

        const newMainData = mainData.map(row => {
          if (row.concepto === 'Despachos CF') {
            // Inicializar todas las columnas en 0
            const updatedRow = {
              ...row,
              distrimar: 0,
              junimar: 0,
              import: 0,
              gondola: 0,
              otros: 0
            };
            
            // Actualizar valores solo para las empresas que tengan datos en el período
            response.forEach(item => {
              if (item.tipo_dato === 'Despachos CF') {
                const empresa = item.empresa.toLowerCase();
                if (empresa in updatedRow) {
                  (updatedRow as { [key: string]: number | string })[empresa] = item.valor;
                }
              }
            });

            return updatedRow;
          }
          return row;
        });

        dispatch(setIvaData(newMainData, deductionsData));
        showSuccess('Datos de Despachos CF actualizados');
      } catch (err) {
        showError('Error al obtener datos de Despachos CF');
      }
    };

    updateDespachosCF();
  }, [selectedPeriod, dispatch]);

  const handleDataChange = (newMainData: IVAData[]) => {
    dispatch(setIvaData(newMainData, deductionsData));
    showSuccess('Los datos se han actualizado correctamente');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Title>Posiciones IVA</Title>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MonthYearPicker
              value={selectedPeriod}
              onChange={setSelectedPeriod}
            />
          </Grid>
        </Grid>
      </Paper>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <IVATable 
        mainData={mainData} 
        deductionsData={deductionsData}
        onDataChange={handleDataChange}
        selectedPeriod={selectedPeriod ? selectedPeriod.format('YYYY-MM') : undefined}
      />
    </Box>
  );
};

export default PosicionesIVA;