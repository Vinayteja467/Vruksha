import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.join(__dirname, '..');

dotenv.config({ path: path.join(serverRoot, '.env') });

const backupDir = path.join(serverRoot, 'backups');

export async function restoreLatestBackup() {
  if (!fs.existsSync(backupDir)) {
    console.error('❌ No backups directory found at:', backupDir);
    return { success: false, message: 'No backups found' };
  }

  const files = fs.readdirSync(backupDir).filter(f => f.endsWith('.json')).sort().reverse();
  if (files.length === 0) {
    console.error('❌ No backup JSON files found to restore.');
    return { success: false, message: 'No backup files found' };
  }

  const latestFile = path.join(backupDir, files[0]);
  console.log(`🔄 Reading latest backup file: ${files[0]}...`);
  const raw = fs.readFileSync(latestFile, 'utf-8');
  const backup = JSON.parse(raw);

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri || mongoUri.includes('<db_username>')) {
    console.log('ℹ️ Running in in-memory mode; backup verified valid.');
    return { success: true, file: files[0], count: Object.keys(backup.data || {}).length };
  }

  try {
    await mongoose.connect(mongoUri);
    for (const [colName, records] of Object.entries(backup.data)) {
      if (Array.isArray(records) && records.length > 0) {
        const col = mongoose.connection.db.collection(colName);
        await col.deleteMany({});
        await col.insertMany(records);
        console.log(`  Restored ${records.length} records into ${colName}`);
      }
    }
    await mongoose.disconnect();
    console.log('✅ Database restore completed successfully.');
    return { success: true, file: files[0] };
  } catch (err) {
    console.error('❌ Restore failed:', err.message);
    throw err;
  }
}

if (process.argv[1] && process.argv[1].endsWith('restore.js')) {
  restoreLatestBackup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
