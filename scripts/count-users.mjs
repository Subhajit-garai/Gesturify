import { neon } from "@neondatabase/serverless";
import fs from "fs";

// Load DATABASE_URL from .env.local
const env = fs.readFileSync(".env.local", "utf8");
const match = env.match(/DATABASE_URL="?([^"\r\n]+)"?/);

if (!match) {
  console.error("DATABASE_URL not found in .env.local");
  process.exit(1);
}

const sql = neon(match[1]);

async function checkUsers() {
  try {
    const countResult = await sql`SELECT count(*)::int AS total FROM neon_auth.user`;
    const total = countResult[0].total;
    console.log(`\n========================================`);
    console.log(`📊 Total Users in Neon DB: ${total}`);
    console.log(`========================================\n`);

    if (total > 0) {
      const users = await sql`
        SELECT id, name, email, "emailVerified", "createdAt" 
        FROM neon_auth.user 
        ORDER BY "createdAt" DESC 
        LIMIT 20
      `;
      console.table(users);
    } else {
      console.log("No registered users found yet in neon_auth.user.");
      console.log("Create an account at http://localhost:3000/sign-up to register your first user!\n");
    }
  } catch (err) {
    console.error("Error querying Neon Auth database:", err.message);
  }
}

checkUsers();
