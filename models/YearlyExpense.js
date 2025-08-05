import mongoose from 'mongoose';

const YearlyExpenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'General',
        'Decoration',
        'Food',
        'Transport',
        'Pooja',
        'Entertainment',
        'Other'
      ]
    },
    year: {
      type: Number,
      required: true
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    addedBy: {
      type: String,
      default: 'Admin'
    },
    comments: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.models.YearlyExpense ||
  mongoose.model('YearlyExpense', YearlyExpenseSchema);
