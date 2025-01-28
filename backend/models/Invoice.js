import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  term: { type: String, required: true },
  year: { type: Number, required: true,default: Date.now },
  totalFees: { type: Number, required: true },
  carriedForwardBalance: { type: Number, default: 0 },
  outstandingBalance: { type: Number, required: true },
  issuedDate: { type: Date, default: Date.now },
  payments: [
    {
      amount: { type: Number, required: true },
      date: { type: Date, default: Date.now },
      reference: { type: String, required: true }, // Track payment reference
    },
  ],
});

export default mongoose.model('Invoice', InvoiceSchema);
