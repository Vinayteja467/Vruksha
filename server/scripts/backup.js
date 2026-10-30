import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.join(__dirname, '..');

// Load environment variables
dotenv.config({ path: path.join(serverRoot, '.env') });

const backupDir = path.join(serverRoot, 'backups');

export async function createDatabaseBackup() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `vruksha-backup-${timestamp}.json`;
  const backupFilePath = path.join(backupDir, backupFileName);

  const mongoUri = process.env.MONGO_URI;

  if (mongoUri && !mongoUri.includes('<db_username>')) {
    try {
      console.log('🔄 Connecting to MongoDB for automated backup snapshot...');
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      const collections = await mongoose.connection.db.listCollections().toArray();
      const backupData = {
        metadata: {
          timestamp: new Date().toISOString(),
          database: mongoose.connection.db.databaseName,
          source: 'MongoDB',
          collectionsCount: collections.length
        },
        data: {}
      };

      for (const col of collections) {
        const docs = await mongoose.connection.db.collection(col.name).find({}).toArray();
        // Sanitize sensitive fields from backup if needed
        backupData.data[col.name] = docs;
        console.log(`  📦 Backed up collection: ${col.name} (${docs.length} records)`);
      }

      fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2), 'utf-8');
      console.log(`✅ MongoDB Backup successfully saved: ${backupFilePath}`);
      await mongoose.disconnect();
      return { success: true, filePath: backupFilePath, fileName: backupFileName };
    } catch (err) {
      console.warn(`⚠️ Direct Mongo backup failed (${err.message}). Falling back to seed/store snapshot...`);
    }
  }

  // Fallback to in-memory store / seed dataset backup
  const { products, categories, coupons, sampleReviews } = await import('../src/data/seedData.js');
  const fallbackData = {
    metadata: {
      timestamp: new Date().toISOString(),
      source: 'InMemoryStoreSnapshot',
      description: 'Snapshot of current seed catalog and configured defaults'
    },
    data: {
      products,
      categories,
      coupons,
      reviews: sampleReviews
    }
  };

  fs.writeFileSync(backupFilePath, JSON.stringify(fallbackData, null, 2), 'utf-8');
  console.log(`✅ Snapshot backup saved to: ${backupFilePath}`);
  return { success: true, filePath: backupFilePath, fileName: backupFileName };
}

// Allow direct CLI execution
if (process.argv[1] && process.argv[1].endsWith('backup.js')) {
  createDatabaseBackup()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Backup failed:', err);
      process.exit(1);
    });
}
