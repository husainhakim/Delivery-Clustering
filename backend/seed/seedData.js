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
import ZoneOperationLog from '../models/ZoneOperationLog.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_delivery_clustering';

const zonesData = [
  // Central Line Cluster
  { zoneId: 'ZN001', name: 'Kurla (Central)', city: 'Mumbai', coordinates: { lat: 19.0653, lng: 72.8794 } },
  { zoneId: 'ZN002', name: 'Matunga',         city: 'Mumbai', coordinates: { lat: 19.0270, lng: 72.8552 } },
  { zoneId: 'ZN003', name: 'Dadar (Central)', city: 'Mumbai', coordinates: { lat: 19.0178, lng: 72.8436 } },
  { zoneId: 'ZN004', name: 'Byculla',         city: 'Mumbai', coordinates: { lat: 18.9772, lng: 72.8335 } },
  { zoneId: 'ZN005', name: 'CSMT',            city: 'Mumbai', coordinates: { lat: 18.9400, lng: 72.8353 } },
  // Harbour Line Cluster
  { zoneId: 'ZN006', name: 'Kurla (Harbour)', city: 'Mumbai', coordinates: { lat: 19.0660, lng: 72.8820 } },
  { zoneId: 'ZN007', name: 'Govandi',         city: 'Mumbai', coordinates: { lat: 19.0553, lng: 72.9142 } },
  { zoneId: 'ZN008', name: 'Vashi',           city: 'Mumbai', coordinates: { lat: 19.0745, lng: 72.9978 } },
  { zoneId: 'ZN009', name: 'Nerul',           city: 'Mumbai', coordinates: { lat: 19.0340, lng: 73.0163 } },
  { zoneId: 'ZN010', name: 'Belapur',         city: 'Mumbai', coordinates: { lat: 19.0189, lng: 73.0392 } },
  { zoneId: 'ZN011', name: 'Panvel',          city: 'Mumbai', coordinates: { lat: 18.9902, lng: 73.1171 } },
  // Western Line Cluster
  { zoneId: 'ZN012', name: 'Churchgate',      city: 'Mumbai', coordinates: { lat: 18.9322, lng: 72.8264 } },
  { zoneId: 'ZN013', name: 'Mumbai Central',  city: 'Mumbai', coordinates: { lat: 18.9696, lng: 72.8193 } },
  { zoneId: 'ZN014', name: 'Dadar (Western)', city: 'Mumbai', coordinates: { lat: 19.0180, lng: 72.8386 } },
  { zoneId: 'ZN015', name: 'Bandra',          city: 'Mumbai', coordinates: { lat: 19.0596, lng: 72.8295 } },
  { zoneId: 'ZN016', name: 'Andheri',         city: 'Mumbai', coordinates: { lat: 19.1136, lng: 72.8497 } },
  { zoneId: 'ZN017', name: 'Borivali',        city: 'Mumbai', coordinates: { lat: 19.2307, lng: 72.8567 } },
  // Isolated Pune
  { zoneId: 'ZN018', name: 'Pune Hub',        city: 'Pune',   coordinates: { lat: 18.5204, lng: 73.8567 } },
  // Delhi NCR Cluster
  { zoneId: 'ZN019', name: 'New Delhi',       city: 'Delhi',     coordinates: { lat: 28.6139, lng: 77.2090 }, courierCount: 15, activeOrders: 350 },
  { zoneId: 'ZN020', name: 'Noida',           city: 'Noida',     coordinates: { lat: 28.5355, lng: 77.3910 }, courierCount: 12, activeOrders: 280 },
  { zoneId: 'ZN021', name: 'Gurgaon',         city: 'Gurgaon',   coordinates: { lat: 28.4595, lng: 77.0266 }, courierCount: 20, activeOrders: 400 },
  { zoneId: 'ZN022', name: 'Faridabad',       city: 'Faridabad', coordinates: { lat: 28.4089, lng: 77.3178 }, courierCount: 8, activeOrders: 150 },
  // Bangalore Cluster
  { zoneId: 'ZN023', name: 'Koramangala',     city: 'Bangalore', coordinates: { lat: 12.9279, lng: 77.6271 }, courierCount: 25, activeOrders: 500 },
  { zoneId: 'ZN024', name: 'Indiranagar',     city: 'Bangalore', coordinates: { lat: 12.9784, lng: 77.6408 }, courierCount: 18, activeOrders: 380 },
  { zoneId: 'ZN025', name: 'Whitefield',      city: 'Bangalore', coordinates: { lat: 12.9698, lng: 77.7499 }, courierCount: 30, activeOrders: 600 },
  // Hyderabad Isolated
  { zoneId: 'ZN026', name: 'Hitec City',      city: 'Hyderabad', coordinates: { lat: 17.4435, lng: 78.3772 }, courierCount: 10, activeOrders: 250 },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Zone.deleteMany({});
    await Route.deleteMany({});
    await ZoneOperationLog.deleteMany({});
    
    try {
      await Zone.collection.dropIndexes();
    } catch (e) {
      console.log('No indexes to drop or index drop failed:', e.message);
    }
    
    console.log('🗑️  Cleared existing zones, routes, and logs');

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

      // Link Central and Harbour to form ONE LARGE CLUSTER
      ['ZN001', 'ZN006'], // Kurla (C) -> Kurla (H)

      // === WESTERN LINE CLUSTER ===
      ['ZN012', 'ZN013'], // Churchgate -> Mumbai Central
      ['ZN013', 'ZN014'], // Mumbai Central -> Dadar (W)
      ['ZN014', 'ZN015'], // Dadar (W) -> Bandra
      ['ZN015', 'ZN016'], // Bandra -> Andheri
      ['ZN016', 'ZN017'], // Andheri -> Borivali

      // === DELHI NCR CLUSTER ===
      ['ZN019', 'ZN020'], // New Delhi -> Noida
      ['ZN019', 'ZN021'], // New Delhi -> Gurgaon
      ['ZN020', 'ZN022'], // Noida -> Faridabad

      // === BANGALORE CLUSTER ===
      ['ZN023', 'ZN024'], // Koramangala -> Indiranagar
      ['ZN024', 'ZN025'], // Indiranagar -> Whitefield
    ];

    const zones = await Zone.insertMany(zonesData);
    console.log(`📍 Inserted ${zones.length} zones`);

    const zoneMap = {};
    zones.forEach((z) => { zoneMap[z.zoneId] = z._id; });

    const routeDocs = routePairs.map(([src, dst]) => ({
      sourceZone: zoneMap[src],
      destinationZone: zoneMap[dst],
      status: 'active'
    }));

    await Route.insertMany(routeDocs);
    console.log(`🔗 Inserted ${routeDocs.length} routes`);

    console.log('\n✨ Seed complete! Expected clusters:');
    console.log('   🟣 Large Cluster (Central + Harbour Networks connected at Kurla)');
    console.log('   🔵 Medium Cluster (Western Line Network)');
    console.log('   🟢 Medium Cluster (Delhi NCR Network)');
    console.log('   🟡 Small Cluster (Bangalore Network)');
    console.log('   🔴 Isolated zones  → Pune Hub, Hyderabad (2 zones)\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
