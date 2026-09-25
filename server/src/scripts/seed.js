import 'dotenv/config';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import projects from '../data/projects.js';

if (!process.env.MONGODB_URI) {
  console.error('Set MONGODB_URI in server/.env before seeding.');
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI);
await Project.deleteMany({});
await Project.insertMany(projects.map((p, i) => ({ ...p, order: i })));
console.log(`Seeded ${projects.length} projects.`);
await mongoose.disconnect();
