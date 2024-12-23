import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useTheme } from '@/contexts/ThemeContext';
import { tableColors } from './tableColors';
import { IIBBData, PerceptionData } from '../types/iibbTypes';
import { formatCurrency } from '@/utils/formatters';

interface IIBBTableProps {
  mainData: IIBBData[];
  perceptionsData: PerceptionData[];
  retentionsData: PerceptionData[];
}

export const IIBBTable = ({ mainData, perceptionsData, retentionsData }: IIBBTableProps) => {
  const { mode } = useTheme();
  const colors = tableColors[mode];

  const calculateTotal = (row: IIBBData | PerceptionData) => {
    return Object.entries(row)
      .filter(([key]) => key !== 'concepto')
      .reduce((sum, [, value]) => sum + (value || 0), 0);
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Conceptos DDJJ Ingresos Brutos</TableCell>
            <TableCell align="right">Import</TableCell>
            <TableCell align="right">Distrimar</TableCell>
            <TableCell align="right">Junimar</TableCell>
            <TableCell align="right">Gondola Led</TableCell>
            <TableCell align="right">Warnes Telas</TableCell>
            <TableCell align="right">Aladmar</TableCell>
            <TableCell align="right">Aftermarket</TableCell>
            <TableCell align="right">Totales</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mainData.map((row) => (
            <TableRow
              key={row.concepto}
              sx={{
                '&:last-child td, &:last-child th': { border: 0 },
                backgroundColor: row.concepto === 'Saldo a pagar' ? colors.warning : 'inherit',
              }}
            >
              <TableCell component="th" scope="row">{row.concepto}</TableCell>
              <TableCell align="right">{formatCurrency(row.import)}</TableCell>
              <TableCell align="right">{formatCurrency(row.distrimar)}</TableCell>
              <TableCell align="right">{formatCurrency(row.junimar)}</TableCell>
              <TableCell align="right">{formatCurrency(row.gondolaLed)}</TableCell>
              <TableCell align="right">{formatCurrency(row.warnesTelas)}</TableCell>
              <TableCell align="right">{formatCurrency(row.aladmar)}</TableCell>
              <TableCell align="right">{formatCurrency(row.aftermarket)}</TableCell>
              <TableCell align="right">{formatCurrency(calculateTotal(row))}</TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell colSpan={9} sx={{ height: '20px' }} />
          </TableRow>

          {perceptionsData.map((row) => (
            <TableRow
              key={row.concepto}
              sx={{
                backgroundColor: row.concepto === 'Total Percepciones ventas' ? colors.success : 'inherit',
              }}
            >
              <TableCell component="th" scope="row">{row.concepto}</TableCell>
              <TableCell align="right">{formatCurrency(row.import)}</TableCell>
              <TableCell align="right">{formatCurrency(row.distrimar)}</TableCell>
              <TableCell align="right">{formatCurrency(row.junimar)}</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">{formatCurrency(calculateTotal(row))}</TableCell>
            </TableRow>
          ))}

          <TableRow>
            <TableCell colSpan={9} sx={{ height: '20px' }} />
          </TableRow>

          {retentionsData.map((row) => (
            <TableRow
              key={row.concepto}
              sx={{
                backgroundColor: row.concepto === 'Total Retenciones pagos' ? colors.success : 'inherit',
              }}
            >
              <TableCell component="th" scope="row">{row.concepto}</TableCell>
              <TableCell align="right">{formatCurrency(row.import)}</TableCell>
              <TableCell align="right">{formatCurrency(row.distrimar)}</TableCell>
              <TableCell align="right">{formatCurrency(row.junimar)}</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">-</TableCell>
              <TableCell align="right">{formatCurrency(calculateTotal(row))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};