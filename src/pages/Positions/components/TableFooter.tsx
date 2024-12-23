import { TableRow, TableCell } from '@mui/material';
import { formatCurrency } from '@/utils/formatters';
import { TableColors } from '../types/theme';

interface TableFooterProps {
  colors: TableColors;
}

export const TableFooter = ({ colors }: TableFooterProps) => (
  <>
    <TableRow>
      <TableCell colSpan={9} sx={{ height: '20px' }} />
    </TableRow>

    <TableRow sx={{ backgroundColor: colors.success }}>
      <TableCell>SLD Periodo (a favor)</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">{formatCurrency(17679638.01)}</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">{formatCurrency(6578.78)}</TableCell>
      <TableCell align="right">{formatCurrency(615042.72)}</TableCell>
      <TableCell align="right">{formatCurrency(2232382.77)}</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">{formatCurrency(20533642.28)}</TableCell>
    </TableRow>

    <TableRow sx={{ backgroundColor: colors.error }}>
      <TableCell>Saldo a Pagar a AFIP</TableCell>
      <TableCell align="right">{formatCurrency(132534139.89)}</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">{formatCurrency(368305.76)}</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">-</TableCell>
      <TableCell align="right">{formatCurrency(567055.47)}</TableCell>
      <TableCell align="right">{formatCurrency(133469501.12)}</TableCell>
    </TableRow>
  </>
);