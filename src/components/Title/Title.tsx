import Typography from '@mui/material/Typography';
import { SxProps, Theme } from '@mui/material/styles';

interface TitleProps {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export default function Title(props: TitleProps) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom sx={props.sx}>
      {props.children}
    </Typography>
  );
}
