import mongoose from 'mongoose';

const ResidentSchema = new mongoose.Schema({
  flatNo: { type: String, required: true },
  gothram: { type: String, required: true },
  familyMembers: { type: String, required: true },
  kids: { type: Number, required: true },
  adults: { type: Number, required: true },
  isApproved: { type: Boolean, default: false },
  contribution: { type: Number, required: true },
  pooja: { type: String, required: false },
  comments: { type: String, required: false }
});

export default mongoose.models.Resident ||
  mongoose.model('Resident', ResidentSchema);
