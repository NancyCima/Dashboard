import { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import Title from '@/components/Title/Title';
import { IIBBTable } from './components/IIBBTable';
import { mainData, perceptionsData, retentionsData } from './data/iibbData';

const PosicionesIIBB = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('');

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Title>Posiciones Ingresos Brutos</Title>
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

      <IIBBTable 
        mainData={mainData}
        perceptionsData={perceptionsData}
        retentionsData={retentionsData}
      />
    </Box>
  );
};

export default PosicionesIIBB;