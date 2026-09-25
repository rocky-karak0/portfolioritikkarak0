import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
    phone: { type: String, trim: true, maxlength: 40, default: '' },
    projectType: { type: String, trim: true, maxlength: 80, default: '' },
    budget: { type: String, trim: true, maxlength: 80, default: '' },
    message: { type: String, required: true, trim: true, maxlength: 4000 },
    ip: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Inquiry', inquirySchema);
