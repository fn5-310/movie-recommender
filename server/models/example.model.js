// DEFUNCT CODE - no mongodb implementation
// keeping for potential later use

import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Example', exampleSchema);
