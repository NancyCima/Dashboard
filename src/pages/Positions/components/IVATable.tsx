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
import { IVAData } from '../types';
import { formatCurrency } from '@/utils/formatters';
import { EditableCell } from './EditableCell';
import { ConfirmDialog } from './ConfirmDialog';
import { useIvaEditing } from '../hooks/useIvaEditing';
import { TableHeader } from './TableHeader';
import { TableFooter } from './TableFooter';

interface IVATableProps {
  mainData: IVAData[];
  deductionsData: IVAData[];
  onDataChange: (data: IVAData[]) => void;
  selectedPeriod?: string;
}

export const IVATable = ({ mainData, deductionsData, onDataChange, selectedPeriod }: IVATableProps) => {
  const { mode } = useTheme();
  const colors = tableColors[mode];
  
  const {
    confirmDialogOpen,
    setConfirmDialogOpen,
    handleEdit,
    handleEditConfirm,
  } = useIvaEditing(mainData, onDataChange, selectedPeriod);

  const calculateTotal = (row: IVAData) => {
    return (Object.entries(row) as [keyof IVAData, string | number][])
      .filter(([key]) => key !== 'concepto')
      .reduce((sum, [, value]) => sum + (typeof value === 'number' ? value : 0), 0);
  };

  const renderCell = (row: IVAData, field: keyof IVAData, index: number) => {
    if (row.concepto === 'Despachos CF' && field !== 'concepto') {
      return (
        <EditableCell
          value={row[field] as number}
          onSave={(value) => handleEdit(index, field, value)}
        />
      );
    }
    return <TableCell align="right">{formatCurrency(row[field] as number)}</TableCell>;
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHeader />
          <TableBody>
            {mainData.map((row, index) => (
              <TableRow
                key={row.concepto}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor: row.concepto === 'Saldo técnico periodo' ? colors.warning : 'inherit',
                }}
              >
                <TableCell component="th" scope="row">{row.concepto}</TableCell>
                {renderCell(row, 'import', index)}
                {renderCell(row, 'distrimar', index)}
                {renderCell(row, 'junimar', index)}
                {renderCell(row, 'gondolaLed', index)}
                {renderCell(row, 'warnesTelas', index)}
                {renderCell(row, 'aladmar', index)}
                {renderCell(row, 'aftermarket', index)}
                <TableCell align="right">{formatCurrency(calculateTotal(row))}</TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={9} sx={{ height: '20px' }} />
            </TableRow>

            <TableRow>
              <TableCell colSpan={9} sx={{ fontWeight: 'bold' }}>Deducciones</TableCell>
            </TableRow>

            {deductionsData.map((row) => (
              <TableRow key={row.concepto}>
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

            <TableFooter colors={colors} />
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleEditConfirm}
        title="Confirmar modificación"
        message="¿Está seguro que desea modificar el valor de Despachos CF? Esta acción no se puede deshacer."
      />
    </>
  );
};