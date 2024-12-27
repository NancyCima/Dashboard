import { Box, Paper, Typography, Grid } from '@mui/material';
import { formatCurrency } from '@/utils/formatters';
import { CurrentAccountData } from '../types';

interface CurrentAccountSummaryProps {
  data: CurrentAccountData;
}

export const CurrentAccountSummary = ({ data }: CurrentAccountSummaryProps) => {
  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            {data.razon_social}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            CUIT: {data.cuit}
          </Typography>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Total Importe
            </Typography>
            <Typography variant="h6">
              {formatCurrency(data.total_importe)}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Total Pagado
            </Typography>
            <Typography variant="h6">
              {formatCurrency(data.total_pagado)}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="subtitle2" color="textSecondary">
              Saldo Actual
            </Typography>
            <Typography variant="h6" color={data.saldo_actual > 0 ? 'error' : 'success'}>
              {formatCurrency(data.saldo_actual)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};