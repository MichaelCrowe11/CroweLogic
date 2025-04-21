import {
  User, InsertUser, Product, InsertProduct, 
  Ingredient, InsertIngredient, ProductIngredient, InsertProductIngredient,
  Batch, InsertBatch, BatchIngredient, InsertBatchIngredient,
  ResearchDocument, InsertResearchDocument,
  ProductWithIngredients, BatchWithDetails, HealthBenefit,
  users, products, ingredients, productIngredients, batches, batchIngredients, researchDocuments
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  validateUser(username: string, password: string): Promise<User | undefined>;

  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductByName(name: string): Promise<Product | undefined>;
  getProductWithIngredients(id: number): Promise<ProductWithIngredients | undefined>;
  getProductsByHealthBenefit(healthBenefit: HealthBenefit): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Ingredient operations
  getIngredients(): Promise<Ingredient[]>;
  getIngredient(id: number): Promise<Ingredient | undefined>;
  createIngredient(ingredient: InsertIngredient): Promise<Ingredient>;
  updateIngredient(id: number, ingredient: Partial<InsertIngredient>): Promise<Ingredient | undefined>;

  // Product Ingredient operations
  addIngredientToProduct(productIngredient: InsertProductIngredient): Promise<ProductIngredient>;
  updateProductIngredient(id: number, productIngredient: Partial<InsertProductIngredient>): Promise<ProductIngredient | undefined>;
  removeIngredientFromProduct(id: number): Promise<boolean>;
  getProductIngredients(productId: number): Promise<ProductIngredient[]>;

  // Batch operations
  getBatches(): Promise<Batch[]>;
  getBatch(id: number): Promise<Batch | undefined>;
  getBatchByCode(batchCode: string): Promise<Batch | undefined>;
  getBatchWithDetails(batchCode: string): Promise<BatchWithDetails | undefined>;
  createBatch(batch: InsertBatch): Promise<Batch>;
  updateBatch(id: number, batch: Partial<InsertBatch>): Promise<Batch | undefined>;
  deleteBatch(id: number): Promise<boolean>;
  getBatchesByProductId(productId: number): Promise<Batch[]>;

  // Batch Ingredient operations
  addIngredientToBatch(batchIngredient: InsertBatchIngredient): Promise<BatchIngredient>;
  getBatchIngredients(batchId: number): Promise<BatchIngredient[]>;

  // Research Document operations
  getResearchDocuments(): Promise<ResearchDocument[]>;
  createResearchDocument(document: InsertResearchDocument): Promise<ResearchDocument>;
  getDocumentsByBatchId(batchId: number): Promise<ResearchDocument[]>;
  getDocumentsByProductId(productId: number): Promise<ResearchDocument[]>;
  getDocumentsByIngredientId(ingredientId: number): Promise<ResearchDocument[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private ingredients: Map<number, Ingredient>;
  private productIngredients: Map<number, ProductIngredient>;
  private batches: Map<number, Batch>;
  private batchIngredients: Map<number, BatchIngredient>;
  private researchDocuments: Map<number, ResearchDocument>;
  
  private userId: number = 1;
  private productId: number = 1;
  private ingredientId: number = 1;
  private productIngredientId: number = 1;
  private batchId: number = 1;
  private batchIngredientId: number = 1;
  private documentId: number = 1;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.ingredients = new Map();
    this.productIngredients = new Map();
    this.batches = new Map();
    this.batchIngredients = new Map();
    this.researchDocuments = new Map();
    
    // Initialize with admin user
    this.createUser({
      username: 'admin',
      password: 'admin123',
      isAdmin: true
    });
    
    // Initialize with sample data for demo
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create ingredients from Crowe Logic™ catalog
    const lionsMane = this.createIngredient({
      name: "Lion's Mane",
      scientificName: "Hericium erinaceus",
      description: "Stimulates Nerve Growth Factor (NGF)"
    });

    const blueOyster = this.createIngredient({
      name: "Blue Oyster",
      scientificName: "Pleurotus ostreatus var. columbinus",
      description: "High ergothioneine levels for antioxidant brain protection"
    });

    const reishi = this.createIngredient({
      name: "Reishi",
      scientificName: "Ganoderma lucidum",
      description: "Reduces neuroinflammation via ganoderic acids and enhances NK cell response"
    });

    const shiitake = this.createIngredient({
      name: "Shiitake",
      scientificName: "Lentinula edodes",
      description: "Lentinan polysaccharides boost immune function"
    });

    const goldenOyster = this.createIngredient({
      name: "Golden Oyster",
      scientificName: "Pleurotus citrinopileatus",
      description: "Rich in immunostimulatory beta-glucans"
    });

    const organicAlcohol = this.createIngredient({
      name: "Organic Cane Alcohol",
      scientificName: "Ethanol",
      description: "Extraction medium for dual extraction process"
    });

    // Create Crowe Logic™ products
    const neuralNexus = this.createProduct({
      name: "Neural Nexus",
      description: "Cognitive Support | Neurogenesis | Stress Resilience",
      sku: "CLF-001",
      healthBenefit: "cognitive",
      image: null,
      status: "active"
    });

    const immuneElevation = this.createProduct({
      name: "Immune Elevation Complex",
      description: "Immune System Modulation | Antiviral Support | Gut-Lymphatic Optimization",
      sku: "CLF-002",
      healthBenefit: "immune",
      image: null,
      status: "active"
    });

    // Add ingredients to Neural Nexus
    this.addIngredientToProduct({
      productId: neuralNexus.id,
      ingredientId: lionsMane.id,
      percentage: 50,
      extractType: "Dual Extraction"
    });

    this.addIngredientToProduct({
      productId: neuralNexus.id,
      ingredientId: blueOyster.id,
      percentage: 20,
      extractType: "Dual Extraction"
    });

    this.addIngredientToProduct({
      productId: neuralNexus.id,
      ingredientId: reishi.id,
      percentage: 15,
      extractType: "Dual Extraction"
    });

    this.addIngredientToProduct({
      productId: neuralNexus.id,
      ingredientId: shiitake.id,
      percentage: 15,
      extractType: "Dual Extraction"
    });

    // Add ingredients to Immune Elevation Complex
    this.addIngredientToProduct({
      productId: immuneElevation.id,
      ingredientId: reishi.id,
      percentage: 40,
      extractType: "Dual Extraction"
    });

    this.addIngredientToProduct({
      productId: immuneElevation.id,
      ingredientId: shiitake.id,
      percentage: 30,
      extractType: "Dual Extraction"
    });

    this.addIngredientToProduct({
      productId: immuneElevation.id,
      ingredientId: goldenOyster.id,
      percentage: 15,
      extractType: "Dual Extraction"
    });

    this.addIngredientToProduct({
      productId: immuneElevation.id,
      ingredientId: lionsMane.id,
      percentage: 15,
      extractType: "Dual Extraction"
    });

    // Create batches
    const neuralNexusBatch = this.createBatch({
      productId: neuralNexus.id,
      batchCode: "CLF001-2304",
      productionDate: new Date("2023-04-15"),
      alcoholPercentage: 30,
      organicCertification: "USDA Organic",
      notes: "Hand-Pressed | Dual Extract | Batch-Coded | 750 mL Artisan Bottles"
    });

    const immuneElevationBatch = this.createBatch({
      productId: immuneElevation.id,
      batchCode: "CLF002-2304",
      productionDate: new Date("2023-04-22"),
      alcoholPercentage: 30,
      organicCertification: "USDA Organic",
      notes: "Hand-Pressed | Dual Extract | Batch-Coded | 750 mL Artisan Bottles"
    });

    // Add ingredients to batches with extraction details
    this.addIngredientToBatch({
      batchId: neuralNexusBatch.id,
      ingredientId: lionsMane.id,
      percentage: 50,
      extractType: "Dual Extraction",
      extractionRatio: "1:4",
      harvestDate: new Date("2023-02-10")
    });

    this.addIngredientToBatch({
      batchId: neuralNexusBatch.id,
      ingredientId: blueOyster.id,
      percentage: 20,
      extractType: "Dual Extraction",
      extractionRatio: "1:4",
      harvestDate: new Date("2023-02-15")
    });

    this.addIngredientToBatch({
      batchId: immuneElevationBatch.id,
      ingredientId: reishi.id,
      percentage: 40,
      extractType: "Dual Extraction",
      extractionRatio: "1:5",
      harvestDate: new Date("2023-02-20")
    });

    this.addIngredientToBatch({
      batchId: immuneElevationBatch.id,
      ingredientId: shiitake.id,
      percentage: 30,
      extractType: "Dual Extraction",
      extractionRatio: "1:5",
      harvestDate: new Date("2023-02-18")
    });

    // Add research documents from the scientific basis data
    this.createResearchDocument({
      title: "Lion's Mane: Stimulates Nerve Growth Factor (NGF)",
      type: "scientific_study",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5987239/",
      productId: neuralNexus.id,
      ingredientId: lionsMane.id,
      batchId: null
    });

    this.createResearchDocument({
      title: "Reishi: Reduces neuroinflammation via ganoderic acids",
      type: "scientific_study",
      url: "https://pubmed.ncbi.nlm.nih.gov/26119957/",
      productId: neuralNexus.id,
      ingredientId: reishi.id,
      batchId: null
    });

    this.createResearchDocument({
      title: "Blue Oyster: High ergothioneine levels for antioxidant brain protection",
      type: "scientific_study",
      url: "https://pubmed.ncbi.nlm.nih.gov/26694367/",
      productId: neuralNexus.id,
      ingredientId: blueOyster.id,
      batchId: null
    });

    this.createResearchDocument({
      title: "Reishi: Enhances NK cell response and balances Th1/Th2",
      type: "scientific_study",
      url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7543704/",
      productId: immuneElevation.id,
      ingredientId: reishi.id,
      batchId: null
    });

    this.createResearchDocument({
      title: "Shiitake: Lentinan polysaccharides boost immune function",
      type: "scientific_study",
      url: "https://pubmed.ncbi.nlm.nih.gov/12730008/",
      productId: immuneElevation.id,
      ingredientId: shiitake.id,
      batchId: null
    });

    this.createResearchDocument({
      title: "Golden Oyster: Rich in immunostimulatory beta-glucans",
      type: "scientific_study",
      url: "https://www.mdpi.com/2072-6643/12/6/1812",
      productId: immuneElevation.id,
      ingredientId: goldenOyster.id,
      batchId: null
    });

    // Add batch-specific documents
    this.createResearchDocument({
      title: "Certificate of Analysis - Neural Nexus CLF001-2304",
      type: "certificate",
      url: "https://example.com/coa-clf001-2304.pdf",
      productId: null,
      ingredientId: null,
      batchId: neuralNexusBatch.id
    });

    this.createResearchDocument({
      title: "Certificate of Analysis - Immune Elevation CLF002-2304",
      type: "certificate",
      url: "https://example.com/coa-clf002-2304.pdf",
      productId: null,
      ingredientId: null,
      batchId: immuneElevationBatch.id
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async validateUser(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return undefined;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductByName(name: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.name === name
    );
  }

  async getProductWithIngredients(id: number): Promise<ProductWithIngredients | undefined> {
    const product = await this.getProduct(id);
    if (!product) return undefined;

    const productIngredients = await this.getProductIngredients(id);
    const ingredientsWithDetails = await Promise.all(
      productIngredients.map(async (pi) => {
        const ingredient = await this.getIngredient(pi.ingredientId);
        return {
          ...pi,
          ingredient: ingredient!
        };
      })
    );

    return {
      ...product,
      ingredients: ingredientsWithDetails
    };
  }

  async getProductsByHealthBenefit(healthBenefit: HealthBenefit): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.healthBenefit === healthBenefit
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = await this.getProduct(id);
    if (!existingProduct) return undefined;

    const updatedProduct = { ...existingProduct, ...product };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Ingredient operations
  async getIngredients(): Promise<Ingredient[]> {
    return Array.from(this.ingredients.values());
  }

  async getIngredient(id: number): Promise<Ingredient | undefined> {
    return this.ingredients.get(id);
  }

  async createIngredient(ingredient: InsertIngredient): Promise<Ingredient> {
    const id = this.ingredientId++;
    const newIngredient: Ingredient = { ...ingredient, id };
    this.ingredients.set(id, newIngredient);
    return newIngredient;
  }

  async updateIngredient(id: number, ingredient: Partial<InsertIngredient>): Promise<Ingredient | undefined> {
    const existingIngredient = await this.getIngredient(id);
    if (!existingIngredient) return undefined;

    const updatedIngredient = { ...existingIngredient, ...ingredient };
    this.ingredients.set(id, updatedIngredient);
    return updatedIngredient;
  }

  // Product Ingredient operations
  async addIngredientToProduct(productIngredient: InsertProductIngredient): Promise<ProductIngredient> {
    const id = this.productIngredientId++;
    const newProductIngredient: ProductIngredient = { ...productIngredient, id };
    this.productIngredients.set(id, newProductIngredient);
    return newProductIngredient;
  }

  async updateProductIngredient(id: number, productIngredient: Partial<InsertProductIngredient>): Promise<ProductIngredient | undefined> {
    const existing = this.productIngredients.get(id);
    if (!existing) return undefined;

    const updated = { ...existing, ...productIngredient };
    this.productIngredients.set(id, updated);
    return updated;
  }

  async removeIngredientFromProduct(id: number): Promise<boolean> {
    return this.productIngredients.delete(id);
  }

  async getProductIngredients(productId: number): Promise<ProductIngredient[]> {
    return Array.from(this.productIngredients.values()).filter(
      (pi) => pi.productId === productId
    );
  }

  // Batch operations
  async getBatches(): Promise<Batch[]> {
    return Array.from(this.batches.values());
  }

  async getBatch(id: number): Promise<Batch | undefined> {
    return this.batches.get(id);
  }

  async getBatchByCode(batchCode: string): Promise<Batch | undefined> {
    return Array.from(this.batches.values()).find(
      (batch) => batch.batchCode === batchCode
    );
  }

  async getBatchWithDetails(batchCode: string): Promise<BatchWithDetails | undefined> {
    const batch = await this.getBatchByCode(batchCode);
    if (!batch) return undefined;

    const product = await this.getProduct(batch.productId);
    if (!product) return undefined;

    const batchIngredients = await this.getBatchIngredients(batch.id);
    const ingredientsWithDetails = await Promise.all(
      batchIngredients.map(async (bi) => {
        const ingredient = await this.getIngredient(bi.ingredientId);
        return {
          ...bi,
          ingredient: ingredient!
        };
      })
    );

    const documents = await this.getDocumentsByBatchId(batch.id);

    return {
      ...batch,
      product,
      ingredients: ingredientsWithDetails,
      documents
    };
  }

  async createBatch(batch: InsertBatch): Promise<Batch> {
    const id = this.batchId++;
    const newBatch: Batch = { ...batch, id };
    this.batches.set(id, newBatch);
    return newBatch;
  }

  async updateBatch(id: number, batch: Partial<InsertBatch>): Promise<Batch | undefined> {
    const existingBatch = await this.getBatch(id);
    if (!existingBatch) return undefined;

    const updatedBatch = { ...existingBatch, ...batch };
    this.batches.set(id, updatedBatch);
    return updatedBatch;
  }

  async deleteBatch(id: number): Promise<boolean> {
    return this.batches.delete(id);
  }

  async getBatchesByProductId(productId: number): Promise<Batch[]> {
    return Array.from(this.batches.values()).filter(
      (batch) => batch.productId === productId
    );
  }

  // Batch Ingredient operations
  async addIngredientToBatch(batchIngredient: InsertBatchIngredient): Promise<BatchIngredient> {
    const id = this.batchIngredientId++;
    const newBatchIngredient: BatchIngredient = { ...batchIngredient, id };
    this.batchIngredients.set(id, newBatchIngredient);
    return newBatchIngredient;
  }

  async getBatchIngredients(batchId: number): Promise<BatchIngredient[]> {
    return Array.from(this.batchIngredients.values()).filter(
      (bi) => bi.batchId === batchId
    );
  }

  // Research Document operations
  async getResearchDocuments(): Promise<ResearchDocument[]> {
    return Array.from(this.researchDocuments.values());
  }

  async createResearchDocument(document: InsertResearchDocument): Promise<ResearchDocument> {
    const id = this.documentId++;
    const newDocument: ResearchDocument = { ...document, id };
    this.researchDocuments.set(id, newDocument);
    return newDocument;
  }

  async getDocumentsByBatchId(batchId: number): Promise<ResearchDocument[]> {
    return Array.from(this.researchDocuments.values()).filter(
      (doc) => doc.batchId === batchId
    );
  }

  async getDocumentsByProductId(productId: number): Promise<ResearchDocument[]> {
    return Array.from(this.researchDocuments.values()).filter(
      (doc) => doc.productId === productId
    );
  }

  async getDocumentsByIngredientId(ingredientId: number): Promise<ResearchDocument[]> {
    return Array.from(this.researchDocuments.values()).filter(
      (doc) => doc.ingredientId === ingredientId
    );
  }
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async validateUser(username: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByUsername(username);
    if (user && user.password === password) {
      return user;
    }
    return undefined;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductByName(name: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.name, name));
    return product || undefined;
  }

  async getProductWithIngredients(id: number): Promise<ProductWithIngredients | undefined> {
    try {
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, id));
      
      if (!product) return undefined;

      const productIngredientEntries = await db
        .select()
        .from(productIngredients)
        .where(eq(productIngredients.productId, id));

      const ingredientsWithDetails = await Promise.all(
        productIngredientEntries.map(async (pi) => {
          const [ingredient] = await db
            .select()
            .from(ingredients)
            .where(eq(ingredients.id, pi.ingredientId));
          
          return {
            ...pi,
            ingredient: ingredient || { 
              id: pi.ingredientId, 
              name: 'Unknown ingredient',
              scientificName: null,
              description: null
            }
          };
        })
      );

      return {
        ...product,
        ingredients: ingredientsWithDetails
      };
    } catch (error) {
      console.error("Error in getProductWithIngredients:", error);
      return undefined;
    }
  }

  async getProductsByHealthBenefit(healthBenefit: HealthBenefit): Promise<Product[]> {
    return db
      .select()
      .from(products)
      .where(eq(products.healthBenefit, healthBenefit));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db
      .update(products)
      .set(product)
      .where(eq(products.id, id))
      .returning();
    return updatedProduct || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning({ id: products.id });
    return !!deleted;
  }

  // Ingredient operations
  async getIngredients(): Promise<Ingredient[]> {
    return db.select().from(ingredients);
  }

  async getIngredient(id: number): Promise<Ingredient | undefined> {
    const [ingredient] = await db.select().from(ingredients).where(eq(ingredients.id, id));
    return ingredient || undefined;
  }

  async createIngredient(ingredient: InsertIngredient): Promise<Ingredient> {
    const [newIngredient] = await db
      .insert(ingredients)
      .values(ingredient)
      .returning();
    return newIngredient;
  }

  async updateIngredient(id: number, ingredient: Partial<InsertIngredient>): Promise<Ingredient | undefined> {
    const [updatedIngredient] = await db
      .update(ingredients)
      .set(ingredient)
      .where(eq(ingredients.id, id))
      .returning();
    return updatedIngredient || undefined;
  }

  // Product Ingredient operations
  async addIngredientToProduct(productIngredient: InsertProductIngredient): Promise<ProductIngredient> {
    const [newProductIngredient] = await db
      .insert(productIngredients)
      .values(productIngredient)
      .returning();
    return newProductIngredient;
  }

  async updateProductIngredient(id: number, productIngredient: Partial<InsertProductIngredient>): Promise<ProductIngredient | undefined> {
    const [updatedProductIngredient] = await db
      .update(productIngredients)
      .set(productIngredient)
      .where(eq(productIngredients.id, id))
      .returning();
    return updatedProductIngredient || undefined;
  }

  async removeIngredientFromProduct(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(productIngredients)
      .where(eq(productIngredients.id, id))
      .returning({ id: productIngredients.id });
    return !!deleted;
  }

  async getProductIngredients(productId: number): Promise<ProductIngredient[]> {
    return db
      .select()
      .from(productIngredients)
      .where(eq(productIngredients.productId, productId));
  }

  // Batch operations
  async getBatches(): Promise<Batch[]> {
    return db.select().from(batches);
  }

  async getBatch(id: number): Promise<Batch | undefined> {
    const [batch] = await db.select().from(batches).where(eq(batches.id, id));
    return batch || undefined;
  }

  async getBatchByCode(batchCode: string): Promise<Batch | undefined> {
    const [batch] = await db.select().from(batches).where(eq(batches.batchCode, batchCode));
    return batch || undefined;
  }

  async getBatchWithDetails(batchCode: string): Promise<BatchWithDetails | undefined> {
    try {
      const [batch] = await db
        .select()
        .from(batches)
        .where(eq(batches.batchCode, batchCode));
        
      if (!batch) return undefined;

      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, batch.productId));

      if (!product) {
        console.warn(`Product not found for batch ${batchCode} with productId ${batch.productId}`);
        return undefined;
      }

      const batchIngredientEntries = await db
        .select()
        .from(batchIngredients)
        .where(eq(batchIngredients.batchId, batch.id));

      const ingredientsWithDetails = await Promise.all(
        batchIngredientEntries.map(async (bi) => {
          const [ingredient] = await db
            .select()
            .from(ingredients)
            .where(eq(ingredients.id, bi.ingredientId));
          
          return {
            ...bi,
            ingredient: ingredient || { 
              id: bi.ingredientId, 
              name: 'Unknown ingredient',
              scientificName: null,
              description: null
            }
          };
        })
      );

      const documents = await db
        .select()
        .from(researchDocuments)
        .where(eq(researchDocuments.batchId, batch.id));

      return {
        ...batch,
        product,
        ingredients: ingredientsWithDetails,
        documents
      };
    } catch (error) {
      console.error("Error in getBatchWithDetails:", error);
      return undefined;
    }
  }

  async createBatch(batch: InsertBatch): Promise<Batch> {
    const [newBatch] = await db
      .insert(batches)
      .values(batch)
      .returning();
    return newBatch;
  }

  async updateBatch(id: number, batch: Partial<InsertBatch>): Promise<Batch | undefined> {
    const [updatedBatch] = await db
      .update(batches)
      .set(batch)
      .where(eq(batches.id, id))
      .returning();
    return updatedBatch || undefined;
  }

  async deleteBatch(id: number): Promise<boolean> {
    const [deleted] = await db
      .delete(batches)
      .where(eq(batches.id, id))
      .returning({ id: batches.id });
    return !!deleted;
  }

  async getBatchesByProductId(productId: number): Promise<Batch[]> {
    return db
      .select()
      .from(batches)
      .where(eq(batches.productId, productId));
  }

  // Batch Ingredient operations
  async addIngredientToBatch(batchIngredient: InsertBatchIngredient): Promise<BatchIngredient> {
    const [newBatchIngredient] = await db
      .insert(batchIngredients)
      .values(batchIngredient)
      .returning();
    return newBatchIngredient;
  }

  async getBatchIngredients(batchId: number): Promise<BatchIngredient[]> {
    return db
      .select()
      .from(batchIngredients)
      .where(eq(batchIngredients.batchId, batchId));
  }

  // Research Document operations
  async getResearchDocuments(): Promise<ResearchDocument[]> {
    return db.select().from(researchDocuments);
  }

  async createResearchDocument(document: InsertResearchDocument): Promise<ResearchDocument> {
    const [newDocument] = await db
      .insert(researchDocuments)
      .values(document)
      .returning();
    return newDocument;
  }

  async getDocumentsByBatchId(batchId: number): Promise<ResearchDocument[]> {
    return db
      .select()
      .from(researchDocuments)
      .where(eq(researchDocuments.batchId, batchId));
  }

  async getDocumentsByProductId(productId: number): Promise<ResearchDocument[]> {
    return db
      .select()
      .from(researchDocuments)
      .where(eq(researchDocuments.productId, productId));
  }

  async getDocumentsByIngredientId(ingredientId: number): Promise<ResearchDocument[]> {
    return db
      .select()
      .from(researchDocuments)
      .where(eq(researchDocuments.ingredientId, ingredientId));
  }
}

// Initialize storage with DatabaseStorage
export const storage = new DatabaseStorage();
