// models/maintenanceMonth.js
import mongoose from 'mongoose';

const MaintenanceRecordSchema = new mongoose.Schema({
  flatNo: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMode: { type: String, enum: ['cash', 'online'], required: true },
  comments: { type: String, default: '' }
});

const ExpenseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true }
});

const MaintenanceMonthSchema = new mongoose.Schema({
  monthName: { type: String, required: true },
  totalMaintenance: { type: Number, required: true },
  totalExpenses: { type: Number, required: true },
  maintenanceData: [MaintenanceRecordSchema],
  expenses: [ExpenseSchema]
});

export default mongoose.models.MaintenanceMonth ||
  mongoose.model('MaintenanceMonth', MaintenanceMonthSchema);
