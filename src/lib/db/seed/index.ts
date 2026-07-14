import * as bcrypt from 'bcryptjs';
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../schema';

async function seed() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
    ssl: { rejectUnauthorized: false },
  });
  const db = drizzle(pool, { schema });

  console.log('🌱 Seeding database...');

  const existing = await db
    .select()
    .from(schema.adminUsers)
    .where(eq(schema.adminUsers.username, 'admin'))
    .limit(1);

  if (existing.length > 0) {
    console.log('✅ Default admin already exists — skipping.');
    await pool.end();
    return;
  }

  const passwordHash = await bcrypt.hash('Admin@123456', 12);

  await db.insert(schema.adminUsers).values({
    username: 'admin',
    passwordHash,
    displayName: 'MDRRMOM Administrator',
    email: 'admin@mdrrmom.gov.ph',
    role: 'admin',
  });

  console.log('✅ Default admin created:');
  console.log('   Username: admin');
  console.log('   Password: Admin@123456');
  console.log('   ⚠️  Change this password immediately after first login!');

  await pool.end();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
