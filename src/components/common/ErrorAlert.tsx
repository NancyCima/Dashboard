import { Alert, AlertProps } from '@mui/material';

interface ErrorAlertProps extends Omit<AlertProps, 'severity'> {
  error: string | null;
}

export const ErrorAlert = ({ error, ...props }: ErrorAlertProps) => {
  if (!error) return null;
  
  return (
    <Alert severity="error" {...props}>
      {error}
    </Alert>
  );
};
