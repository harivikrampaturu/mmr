import mongoose from 'mongoose';

const maintenanceDataSchema = new mongoose.Schema({
  flatNo: Number,
  payment: String,
  comments: String
});

const expenseSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  expenseDate: String
});

const maintenanceSchema = new mongoose.Schema(
  {
    monthName: String,
    amount: Number,
    partialAmount: Number,
    maintenanceData: [maintenanceDataSchema],
    expenses: [expenseSchema]
  },
  { timeStamps: true }
);

const Maintenance =
  mongoose.models.Maintenance ||
  mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance;
