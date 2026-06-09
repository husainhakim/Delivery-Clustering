/**
 * Seed Script — Smart Delivery Zone Clustering
 * Run: npm run seed
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

import Zone from '../models/Zone.js';
import Route from '../models/Route.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_delivery_clustering';

const zonesData = [
  { name: 'Mumbai North',   city: 'Mumbai', zoneCode: 'ZN001' },
  { name: 'Mumbai South',   city: 'Mumbai', zoneCode: 'ZN002' },
  { name: 'Mumbai Central', city: 'Mumbai', zoneCode: 'ZN003' },
  { name: 'Andheri',        city: 'Mumbai', zoneCode: 'ZN004' },
  { name: 'Bandra',         city: 'Mumbai', zoneCode: 'ZN005' },
  { name: 'Thane',          city: 'Mumbai', zoneCode: 'ZN006' },
  { name: 'Dadar',          city: 'Mumbai', zoneCode: 'ZN007' },
  { name: 'Malad',          city: 'Mumbai', zoneCode: 'ZN008' },
  { name: 'Borivali',       city: 'Mumbai', zoneCode: 'ZN009' }, // Isolated
  { name: 'Navi Mumbai',    city: 'Mumbai', zoneCode: 'ZN010' },
  { name: 'Kurla',          city: 'Mumbai', zoneCode: 'ZN011' },
  { name: 'Pune East',      city: 'Pune',   zoneCode: 'ZN012' },
  { name: 'Pune West',      city: 'Pune',   zoneCode: 'ZN013' },
  { name: 'Pune Central',   city: 'Pune',   zoneCode: 'ZN014' },
  { name: 'Hadapsar',       city: 'Pune',   zoneCode: 'ZN015' },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Zone.deleteMany({});
    await Route.deleteMany({});
    console.log('🗑️  Cleared existing zones and routes');

    const zones = await Zone.insertMany(zonesData);
    console.log(`📍 Inserted ${zones.length} zones`);

    const zoneMap = {};
    zones.forEach((z) => { zoneMap[z.zoneCode] = z._id; });

    const routePairs = [
      // === LARGE CLUSTER (ZN001–ZN008, 8 Mumbai core zones) ===
      ['ZN001', 'ZN002'],
      ['ZN002', 'ZN003'],
      ['ZN003', 'ZN004'],
      ['ZN004', 'ZN005'],
      ['ZN005', 'ZN007'],
      ['ZN006', 'ZN001'],
      ['ZN008', 'ZN004'],
      ['ZN007', 'ZN006'],
      // === SMALL CLUSTER (ZN010 + ZN011) ===
      ['ZN010', 'ZN011'],
      // === MEDIUM CLUSTER (Pune: ZN012–ZN015) ===
      ['ZN012', 'ZN013'],
      ['ZN013', 'ZN014'],
      ['ZN014', 'ZN015'],
      ['ZN015', 'ZN012'],
      // ZN009 Borivali — intentionally isolated
    ];

    const routeDocs = routePairs.map(([src, dst]) => ({
      sourceZone: zoneMap[src],
      destinationZone: zoneMap[dst],
    }));

    await Route.insertMany(routeDocs);
    console.log(`🔗 Inserted ${routeDocs.length} routes`);

    console.log('\n✨ Seed complete! Expected clusters:');
    console.log('   🟣 Large cluster  → Mumbai North, South, Central, Andheri, Bandra, Thane, Dadar, Malad (8 zones)');
    console.log('   🔵 Small cluster  → Navi Mumbai, Kurla (2 zones)');
    console.log('   🟢 Medium cluster → Pune East, West, Central, Hadapsar (4 zones)');
    console.log('   🔴 Isolated zone  → Borivali (1 zone)\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
