import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { eq } from 'drizzle-orm';

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

async function updateProductDescriptions() {
  console.log("Updating product descriptions...");

  // Neural Nexus
  await db
    .update(schema.products)
    .set({
      description: "Enhances neural pathways and stimulates NGF production. Lion's Mane mycelium promotes neurogenesis and cognitive clarity while Reishi provides adaptogenic stress-resilience."
    })
    .where(eq(schema.products.sku, "CLF-001"));
  
  // Immune Elevation
  await db
    .update(schema.products)
    .set({
      description: "Powerful immune support featuring beta-glucan rich Reishi and Shiitake. Enhances NK cell activity and balances Th1/Th2 response while supporting gut-lymphatic optimization."
    })
    .where(eq(schema.products.sku, "CLF-002"));
  
  // Vital Shield
  await db
    .update(schema.products)
    .set({
      description: "Advanced cardiovascular support formula with potent vasodilatory compounds that optimize blood flow and circulation. Contains cordyceps for enhanced ATP production and endurance."
    })
    .where(eq(schema.products.sku, "CLF-003"));
  
  // Mood Harmony
  await db
    .update(schema.products)
    .set({
      description: "Balances emotional states and regulates neurotransmitter activity with soothing adaptogenic compounds. Includes Reishi, Turkey Tail and other mood-stabilizing mushroom extracts."
    })
    .where(eq(schema.products.sku, "CLF-004"));
  
  // Mycobeauty Elixir
  await db
    .update(schema.products)
    .set({
      description: "Skin-revitalizing formula rich in antioxidants that combat free radical damage. Contains bioactive compounds that support collagen synthesis for youthful, radiant skin."
    })
    .where(eq(schema.products.sku, "CLF-005"));

  console.log("Product descriptions updated successfully!");
}

// Execute the update function
updateProductDescriptions()
  .then(() => {
    console.log("Update completed successfully, exiting");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error updating product descriptions:", error);
    process.exit(1);
  });