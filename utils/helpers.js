import { format } from 'date-fns';

export const getFormatedMonthName = (month) => {
  return format(month, 'MMMM yyyy');
};
