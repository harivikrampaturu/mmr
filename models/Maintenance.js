import mongoose from 'mongoose';

const maintenanceDataSchema = new mongoose.Schema({
  flatNo: Number,
  residentName: String,
  payment: String,
  comments: String,
  date: String,
  status: String,
  paymentMode: String,
  signature: String
});

const expenseSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  expenseDate: String,
  bill: Boolean,
  billNumber: String
});

const maintenanceSchema = new mongoose.Schema(
  {
    monthName: String,
    amount: Number,
    partialAmount: Number,
    openingBalance: Number,
    additionalIncome: Number,
    maintenanceData: [maintenanceDataSchema],
    totalWaterAmount: Number,
    expenses: [expenseSchema]
  },
  { timeStamps: true }
);

const Maintenance =
  mongoose.models.Maintenance ||
  mongoose.model('Maintenance', maintenanceSchema);

export default Maintenance;