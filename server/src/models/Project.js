import mongoose from 'mongoose';

export const CATEGORIES = [
  'Commercials',
  'Music Videos',
  'Documentaries',
  'Narrative Films',
  'Corporate',
  'Social Content',
];

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: CATEGORIES },
    client: { type: String, default: '' },
    agency: { type: String, default: '' },
    director: { type: String, default: '' },
    role: { type: String, default: 'Editor' },
    year: { type: Number },
    description: { type: String, default: '' },
    // Media
    videoUrl: { type: String, default: '' }, // YouTube / Vimeo / .mp4 URL
    previewUrl: { type: String, default: '' }, // short looping mp4 for hover-preview
    poster: { type: String, default: '' },
    gradient: { type: [String], default: [] }, // fallback poster colours
    // Extras
    behindTheScenes: { type: [String], default: [] },
    press: { type: [String], default: [] },
    tools: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    sample: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
