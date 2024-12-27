import dayjs, { Dayjs } from 'dayjs';

export const getDateRange = (period: string): { startDate: Dayjs; endDate: Dayjs } => {
  const now = dayjs();
  
  switch (period) {
    case 'month':
      return {
        startDate: now.startOf('month'),
        endDate: now.endOf('month')
      };
    case 'quarter':
      return {
        startDate: now.startOf('quarter'),
        endDate: now.endOf('quarter')
      };
    case 'year':
      return {
        startDate: now.startOf('year'),
        endDate: now.endOf('year')
      };
    default:
      return {
        startDate: now.startOf('month'),
        endDate: now.endOf('month')
      };
  }
};

export const formatDateForAPI = (date: Dayjs): string => {
  return date.format('YYYY-MM-DD');
};