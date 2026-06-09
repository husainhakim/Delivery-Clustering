import mongoose from 'mongoose';
import './env.js';

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const zones = await db.collection('zones').find().toArray();
  console.log("Zones in DB:", zones.length);
  const routes = await db.collection('routes').find().toArray();
  console.log("Routes in DB:", routes.length);
  process.exit(0);
}
run();
