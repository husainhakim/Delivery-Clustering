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
  // Central Line Cluster
  { name: 'Kurla (Central)', city: 'Mumbai', zoneCode: 'ZN001' },
  { name: 'Matunga',         city: 'Mumbai', zoneCode: 'ZN002' },
  { name: 'Dadar (Central)', city: 'Mumbai', zoneCode: 'ZN003' },
  { name: 'Byculla',         city: 'Mumbai', zoneCode: 'ZN004' },
  { name: 'CSMT',            city: 'Mumbai', zoneCode: 'ZN005' },
  // Harbour Line Cluster
  { name: 'Kurla (Harbour)', city: 'Mumbai', zoneCode: 'ZN006' },
  { name: 'Govandi',         city: 'Mumbai', zoneCode: 'ZN007' },
  { name: 'Vashi',           city: 'Mumbai', zoneCode: 'ZN008' },
  { name: 'Nerul',           city: 'Mumbai', zoneCode: 'ZN009' },
  { name: 'Belapur',         city: 'Mumbai', zoneCode: 'ZN010' },
  { name: 'Panvel',          city: 'Mumbai', zoneCode: 'ZN011' },
  // Western Line Cluster
  { name: 'Churchgate',      city: 'Mumbai', zoneCode: 'ZN012' },
  { name: 'Mumbai Central',  city: 'Mumbai', zoneCode: 'ZN013' },
  { name: 'Dadar (Western)', city: 'Mumbai', zoneCode: 'ZN014' },
  { name: 'Bandra',          city: 'Mumbai', zoneCode: 'ZN015' },
  { name: 'Andheri',         city: 'Mumbai', zoneCode: 'ZN016' },
  { name: 'Borivali',        city: 'Mumbai', zoneCode: 'ZN017' },
  // Isolated Pune
  { name: 'Pune Hub',        city: 'Pune',   zoneCode: 'ZN018' },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Zone.deleteMany({});
    await Route.deleteMany({});
    console.log('🗑️  Cleared existing zones and routes');

    const routePairs = [
      // === CENTRAL LINE CLUSTER ===
      ['ZN001', 'ZN002'], // Kurla (C) -> Matunga
      ['ZN002', 'ZN003'], // Matunga -> Dadar (C)
      ['ZN003', 'ZN004'], // Dadar (C) -> Byculla
      ['ZN004', 'ZN005'], // Byculla -> CSMT

      // === HARBOUR LINE CLUSTER ===
      ['ZN006', 'ZN007'], // Kurla (H) -> Govandi
      ['ZN007', 'ZN008'], // Govandi -> Vashi
      ['ZN008', 'ZN009'], // Vashi -> Nerul
      ['ZN009', 'ZN010'], // Nerul -> Belapur
      ['ZN010', 'ZN011'], // Belapur -> Panvel

      // === WESTERN LINE CLUSTER ===
      ['ZN012', 'ZN013'], // Churchgate -> Mumbai Central
      ['ZN013', 'ZN014'], // Mumbai Central -> Dadar (W)
      ['ZN014', 'ZN015'], // Dadar (W) -> Bandra
      ['ZN015', 'ZN016'], // Bandra -> Andheri
      ['ZN016', 'ZN017'], // Andheri -> Borivali
    ];

    const zones = await Zone.insertMany(zonesData);
    console.log(`📍 Inserted ${zones.length} zones`);

    const zoneMap = {};
    zones.forEach((z) => { zoneMap[z.zoneCode] = z._id; });

    const routeDocs = routePairs.map(([src, dst]) => ({
      sourceZone: zoneMap[src],
      destinationZone: zoneMap[dst],
    }));

    await Route.insertMany(routeDocs);
    console.log(`🔗 Inserted ${routeDocs.length} routes`);

    console.log('\n✨ Seed complete! Expected clusters:');
    console.log('   🟣 Massive Mumbai Network (Central, Harbour, and Western connected at Kurla and Dadar)');
    console.log('   🔴 Isolated zone  → Pune Hub (1 zone)\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
