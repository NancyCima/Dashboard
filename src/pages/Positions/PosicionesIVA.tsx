import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import Title from '@/components/Title/Title';
import { IVATable } from './components/IVATable';
import { mainData as initialMainData, deductionsData } from './data/ivaData';
import { IVAData } from './types';
import { useSnackbar } from '@/hooks/useSnackbar';
import { useCustomData } from './hooks/useCustomData';
import dayjs from 'dayjs';

const PosicionesIVA = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('202311');
  const [ivaData, setIvaData] = useState({
    mainData: initialMainData,
    deductionsData: deductionsData
  });
  const { showSuccess, showError } = useSnackbar();
  const { fetchCustomData, loading, error } = useCustomData();

  useEffect(() => {
    const updateDespachosCF = async () => {
      if (!selectedPeriod) return;

      const year = selectedPeriod.substring(0, 4);
      const month = selectedPeriod.substring(4, 6);
      const desde = `${year}-${month}-01`;
      const hasta = dayjs(desde).endOf('month').format('YYYY-MM-DD');

      try {
        const response = await fetchCustomData(
          'Despachos CF',
          desde,
          hasta
        );

        if (response.length > 0) {
          const newMainData = ivaData.mainData.map(row => {
            if (row.concepto === 'Despachos CF') {
              // Creamos un objeto con los valores actuales
              const updatedRow = { ...row };
              
              // Actualizamos cada empresa con su valor correspondiente
              response.forEach(item => {
                const empresaKey = item.empresa.toLowerCase();
                if (empresaKey in updatedRow) {
                  (updatedRow as any)[empresaKey] = item.valor;
                }
              });
              
              return updatedRow;
            }
            return row;
          });

          setIvaData(prev => ({
            ...prev,
            mainData: newMainData
          }));
          showSuccess('Datos de Despachos CF actualizados');
        }
      } catch (err) {
        showError('Error al obtener datos de Despachos CF');
      }
    };

    updateDespachosCF();
  }, [selectedPeriod]);

  const handleDataChange = (newMainData: IVAData[]) => {
    setIvaData(prev => ({
      ...prev,
      mainData: newMainData
    }));
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
            <FormControl fullWidth>
              <InputLabel>Período</InputLabel>
              <Select
                value={selectedPeriod}
                label="Período"
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <MenuItem value="202311">Noviembre 2023</MenuItem>
                <MenuItem value="202312">Diciembre 2023</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      <IVATable 
        mainData={ivaData.mainData} 
        deductionsData={ivaData.deductionsData}
        onDataChange={handleDataChange}
      />
    </Box>
  );
};

export default PosicionesIVA;