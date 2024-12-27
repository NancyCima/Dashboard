// src/components/common/DataTable/index.tsx
import { Table, TableContainer, Paper } from '@mui/material';
import { TableHeader } from './TableHeader';
import { TableBody } from './TableBody';
import { TablePagination } from './TablePagination';
import { Column } from './types';

interface DataTableProps<T> {
  columns: Column[];
  data: T[];
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

export const DataTable = <T extends Record<string, any>>({
  columns,
  data,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}: DataTableProps<T>) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHeader columns={columns} />
      <TableBody columns={columns} data={data} page={page} rowsPerPage={rowsPerPage} />
    </Table>
    <TablePagination
      count={data.length}
      page={page}
      rowsPerPage={rowsPerPage} 
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  </TableContainer>
);
