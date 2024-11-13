import {
  PAYMENT_PAID,
  PAYMENT_PARTIAL,
  PAYMENT_PENDING,
  STATUS_INPROGRESS
} from '@/app/constants';
import { format } from 'date-fns';

export const getFormatedMonthName = (month) => {
  return format(month, 'MMMM yyyy');
};

export const calculateTotalMaintenance = (maintenanceData, amounts) => {
  return maintenanceData.reduce((total, record) => {
    if (record.payment === PAYMENT_PAID) return total + amounts.amount;
    else if (record.payment === PAYMENT_PENDING) return total;
    else if (record.payment === PAYMENT_PARTIAL) return total + amounts.partial;
    return total;
  }, 0);
};

export const calculateTotalExpenses = (expenses = []) => {
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

export const handlePendingApprovals = (maintenanceData) => {
  return maintenanceData.reduce((total, maintenanceData) => {
    return Boolean(maintenanceData.status === STATUS_INPROGRESS)
      ? total + 1
      : total;
  }, 0);
};

// Helper function for creating Blob URLs
export const createBlobUrl = (blobData) => {
  const url = window.URL.createObjectURL(blobData);
  const link = document.createElement('a');
  link.href = url;
  return { url, link };
};
