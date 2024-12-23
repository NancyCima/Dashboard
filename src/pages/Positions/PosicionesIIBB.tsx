import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper, Grid } from '@mui/material';
import Title from '@/components/Title/Title';
import { IIBBTable } from './components/IIBBTable';
import { MonthYearPicker } from '@/components/MonthYearPicker/MonthYearPicker';
import { resetIibbData } from '@/store/positions/actions';
import { RootState } from '@/store';
import dayjs, { Dayjs } from 'dayjs';

const PosicionesIIBB = () => {
  const dispatch = useDispatch();
  const { mainData, perceptionsData, retentionsData } = useSelector(
    (state: RootState) => state.positions.iibb
  );
  const [selectedPeriod, setSelectedPeriod] = useState<Dayjs | null>(dayjs());

  useEffect(() => {
    dispatch(resetIibbData());
  }, [dispatch]);

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Title>Posiciones Ingresos Brutos</Title>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MonthYearPicker
              value={selectedPeriod}
              onChange={setSelectedPeriod}
            />
          </Grid>
        </Grid>
      </Paper>

      <IIBBTable 
        mainData={mainData}
        perceptionsData={perceptionsData}
        retentionsData={retentionsData}
      />
    </Box>
  );
};

export default PosicionesIIBB;