import { db } from "./db";
import {
  users, products, ingredients, productIngredients, batches, batchIngredients, researchDocuments
} from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Create admin user
  const [admin] = await db
    .insert(users)
    .values({
      username: 'admin',
      password: 'admin123',
      isAdmin: true
    })
    .returning();

  console.log("Created admin user");

  // Create ingredients
  const [lionsMane] = await db
    .insert(ingredients)
    .values({
      name: "Lion's Mane",
      scientificName: "Hericium erinaceus",
      description: "Stimulates Nerve Growth Factor (NGF)"
    })
    .returning();

  const [blueOyster] = await db
    .insert(ingredients)
    .values({
      name: "Blue Oyster",
      scientificName: "Pleurotus ostreatus var. columbinus",
      description: "High ergothioneine levels for antioxidant brain protection"
    })
    .returning();

  const [reishi] = await db
    .insert(ingredients)
    .values({
      name: "Reishi",
      scientificName: "Ganoderma lucidum",
      description: "Reduces neuroinflammation via ganoderic acids and enhances NK cell response"
    })
    .returning();

  const [shiitake] = await db
    .insert(ingredients)
    .values({
      name: "Shiitake",
      scientificName: "Lentinula edodes",
      description: "Lentinan polysaccharides boost immune function"
    })
    .returning();

  const [goldenOyster] = await db
    .insert(ingredients)
    .values({
      name: "Golden Oyster",
      scientificName: "Pleurotus citrinopileatus",
      description: "Rich in immunostimulatory beta-glucans"
    })
    .returning();

  const [organicAlcohol] = await db
    .insert(ingredients)
    .values({
      name: "Organic Cane Alcohol",
      scientificName: "Ethanol",
      description: "Extraction medium for dual extraction process"
    })
    .returning();

  console.log("Created ingredients");

  // Create products
  const [neuralNexus] = await db
    .insert(products)
    .values({
      name: "Neural Nexus",
      description: "Enhances neural pathways and stimulates NGF production. Lion's Mane mycelium promotes neurogenesis and cognitive clarity while Reishi provides adaptogenic stress-resilience.",
      sku: "CLF-001",
      healthBenefit: "cognitive",
      image: "/images/products/neural-nexus.png",
      status: "active"
    })
    .returning();

  const [immuneElevation] = await db
    .insert(products)
    .values({
      name: "Immune Elevation Complex",
      description: "Powerful immune support featuring beta-glucan rich Reishi and Shiitake. Enhances NK cell activity and balances Th1/Th2 response while supporting gut-lymphatic optimization.",
      sku: "CLF-002",
      healthBenefit: "immune",
      image: "/images/products/immune-elevation.png",
      status: "active"
    })
    .returning();
    
  const [vitalShield] = await db
    .insert(products)
    .values({
      name: "Vital Shield",
      description: "Advanced cardiovascular support formula with potent vasodilatory compounds that optimize blood flow and circulation. Contains cordyceps for enhanced ATP production and endurance.",
      sku: "CLF-003",
      healthBenefit: "energy",
      image: "/images/products/vital-shield.png",
      status: "coming_soon"
    })
    .returning();
    
  const [moodHarmony] = await db
    .insert(products)
    .values({
      name: "Mood Harmony",
      description: "Balances emotional states and regulates neurotransmitter activity with soothing adaptogenic compounds. Includes Reishi, Turkey Tail and other mood-stabilizing mushroom extracts.",
      sku: "CLF-004",
      healthBenefit: "relaxation",
      image: "/images/products/mood-harmony.png",
      status: "coming_soon"
    })
    .returning();
    
  const [mycobeautyElixir] = await db
    .insert(products)
    .values({
      name: "Mycobeauty Elixir",
      description: "Skin-revitalizing formula rich in antioxidants that combat free radical damage. Contains bioactive compounds that support collagen synthesis for youthful, radiant skin.",
      sku: "CLF-005",
      healthBenefit: "immune",
      image: "/images/products/mycobeauty-elixir.png",
      status: "coming_soon"
    })
    .returning();

  console.log("Created products");

  // Add ingredients to Neural Nexus
  await db
    .insert(productIngredients)
    .values({
      productId: neuralNexus.id,
      ingredientId: lionsMane.id,
      percentage: 50,
      extractType: "Dual Extraction"
    });

  await db
    .insert(productIngredients)
    .values({
      productId: neuralNexus.id,
      ingredientId: blueOyster.id,
      percentage: 20,
      extractType: "Dual Extraction"
    });

  await db
    .insert(productIngredients)
    .values({
      productId: neuralNexus.id,
      ingredientId: reishi.id,
      percentage: 15,
      extractType: "Dual Extraction"
    });

  await db
    .insert(productIngredients)
    .values({
      productId: neuralNexus.id,
      ingredientId: shiitake.id,
      percentage: 15,
      extractType: "Dual Extraction"
    });

  // Add ingredients to Immune Elevation Complex
  await db
    .insert(productIngredients)
    .values({
      productId: immuneElevation.id,
      ingredientId: reishi.id,
      percentage: 40,
      extractType: "Dual Extraction"
    });

  await db
    .insert(productIngredients)
    .values({
      productId: immuneElevation.id,
      ingredientId: shiitake.id,
      percentage: 30,
      extractType: "Dual Extraction"
    });

  await db
    .insert(productIngredients)
    .values({
      productId: immuneElevation.id,
      ingredientId: goldenOyster.id,
      percentage: 15,
      extractType: "Dual Extraction"
    });

  await db
    .insert(productIngredients)
    .values({
      productId: immuneElevation.id,
      ingredientId: lionsMane.id,
      percentage: 15,
      extractType: "Dual Extraction"
    });

  console.log("Added ingredients to products");

  // Create batches
  const [neuralNexusBatch] = await db
    .insert(batches)
    .values({
      productId: neuralNexus.id,
      batchCode: "CLF001-2304",
      productionDate: new Date("2023-04-15"),
      alcoholPercentage: 30,
      organicCertification: "USDA Organic",
      notes: "Hand-Pressed | Dual Extract | Batch-Coded | 750 mL Artisan Bottles"
    })
    .returning();

  const [immuneElevationBatch] = await db
    .insert(batches)
    .values({
      productId: immuneElevation.id,
      batchCode: "CLF002-2304",
      productionDate: new Date("2023-04-22"),
      alcoholPercentage: 30,
      organicCertification: "USDA Organic",
      notes: "Hand-Pressed | Dual Extract | Batch-Coded | 750 mL Artisan Bottles"
    })
    .returning();

  console.log("Created batches");

  // Add ingredients to batches with extraction details
  await db
    .insert(batchIngredients)
    .values({
      batchId: neuralNexusBatch.id,
      ingredientId: lionsMane.id,
      percentage: 50,
      extractType: "Dual Extraction",
      extractionRatio: "1:4",
      harvestDate: new Date("2023-02-10")
    });

  await db
    .insert(batchIngredients)
    .values({
      batchId: neuralNexusBatch.id,
      ingredientId: blueOyster.id,
      percentage: 20,
      extractType: "Dual Extraction",
      extractionRatio: "1:4",
      harvestDate: new Date("2023-02-15")
    });

  await db
    .insert(batchIngredients)
    .values({
      batchId: immuneElevationBatch.id,
      ingredientId: reishi.id,
      percentage: 40,
      extractType: "Dual Extraction",
      extractionRatio: "1:5",
      harvestDate: new Date("2023-02-20")
    });

  await db
    .insert(batchIngredients)
    .values({
      batchId: immuneElevationBatch.id,
      ingredientId: shiitake.id,
      percentage: 30,
      extractType: "Dual Extraction",
      extractionRatio: "1:5",
      harvestDate: new Date("2023-02-18")
    });

  console.log("Added ingredients to batches");

  // Add research documents
  await db
    .insert(researchDocuments)
    .values({
      title: "Lion's Mane: Stimulates Nerve Growth Factor (NGF)",
      type: "scientific_study",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5987239/",
      productId: neuralNexus.id,
      ingredientId: lionsMane.id,
      batchId: null
    });

  await db
    .insert(researchDocuments)
    .values({
      title: "Reishi: Reduces neuroinflammation via ganoderic acids",
      type: "scientific_study",
      url: "https://pubmed.ncbi.nlm.nih.gov/26119957/",
      productId: neuralNexus.id,
      ingredientId: reishi.id,
      batchId: null
    });

  await db
    .insert(researchDocuments)
    .values({
      title: "Blue Oyster: High ergothioneine levels for antioxidant brain protection",
      type: "scientific_study",
      url: "https://pubmed.ncbi.nlm.nih.gov/26694367/",
      productId: neuralNexus.id,
      ingredientId: blueOyster.id,
      batchId: null
    });

  await db
    .insert(researchDocuments)
    .values({
      title: "Reishi: Enhances NK cell response and balances Th1/Th2",
      type: "scientific_study",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7543704/",
      productId: immuneElevation.id,
      ingredientId: reishi.id,
      batchId: null
    });

  await db
    .insert(researchDocuments)
    .values({
      title: "Shiitake: Lentinan polysaccharides boost immune function",
      type: "scientific_study",
      url: "https://pubmed.ncbi.nlm.nih.gov/12730008/",
      productId: immuneElevation.id,
      ingredientId: shiitake.id,
      batchId: null
    });

  await db
    .insert(researchDocuments)
    .values({
      title: "Golden Oyster: Rich in immunostimulatory beta-glucans",
      type: "scientific_study",
      url: "https://www.mdpi.com/2072-6643/12/6/1812",
      productId: immuneElevation.id,
      ingredientId: goldenOyster.id,
      batchId: null
    });

  // Add batch-specific documents
  await db
    .insert(researchDocuments)
    .values({
      title: "Certificate of Analysis - Neural Nexus CLF001-2304",
      type: "certificate",
      url: "https://example.com/coa-clf001-2304.pdf",
      productId: null,
      ingredientId: null,
      batchId: neuralNexusBatch.id
    });

  await db
    .insert(researchDocuments)
    .values({
      title: "Certificate of Analysis - Immune Elevation CLF002-2304",
      type: "certificate",
      url: "https://example.com/coa-clf002-2304.pdf",
      productId: null,
      ingredientId: null,
      batchId: immuneElevationBatch.id
    });

  console.log("Added research documents");
  console.log("Database seeding completed successfully!");
}

// Since we're using ES modules, directly run the seed function
seed()
  .then(() => {
    console.log("Seed completed successfully, exiting");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });

export { seed };