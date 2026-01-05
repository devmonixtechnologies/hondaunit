import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    handle: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ['new', 'in_progress', 'resolved'], default: 'new' },
    adminNotes: { type: String, trim: true },
    respondedAt: { type: Date },
    archived: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const ContactMessage =
  mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
