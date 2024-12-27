import { IconButton, CircularProgress, Tooltip, IconButtonProps } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface LoadingButtonProps extends Omit<IconButtonProps, 'children'> {
  loading?: boolean;
  tooltipText?: string;
}

export const LoadingButton = ({ loading = false, tooltipText = 'Buscar', ...props }: LoadingButtonProps) => (
  <Tooltip title={tooltipText}>
    <IconButton {...props} disabled={loading || props.disabled}>
      {loading ? <CircularProgress size={24} /> : <PlayArrowIcon color="primary" />}
    </IconButton>
  </Tooltip>
);