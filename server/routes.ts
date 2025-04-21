import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertProductSchema, insertIngredientSchema, 
  insertProductIngredientSchema, insertBatchSchema, 
  insertBatchIngredientSchema, insertResearchDocumentSchema,
  healthBenefits
} from "@shared/schema";
import express from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// Extend the Express Session type to include userId
declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  const MemoryStoreSession = MemoryStore(session);
  app.use(
    session({
      secret: "crowe-logic-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production" },
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );

  // Helper middleware for auth
  const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  const requireAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    next();
  };

  // Helper for handling zod validation errors
  const handleZodError = (error: unknown, res: express.Response) => {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ 
        message: validationError.message,
        errors: error.errors 
      });
    }
    return res.status(500).json({ message: "Internal server error" });
  };

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.validateUser(username, password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      req.session.userId = user.id;
      
      return res.status(200).json({
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/session", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    return res.status(200).json({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin
    });
  });

  // Product API routes
  app.get("/api/products", async (req, res) => {
    try {
      const healthBenefit = req.query.healthBenefit as string;
      
      let products = [];
      if (healthBenefit && healthBenefits.includes(healthBenefit as any)) {
        products = await storage.getProductsByHealthBenefit(healthBenefit as any);
      } else {
        products = await storage.getProducts();
      }
      
      // Fetch detailed product info with ingredients for each product
      const productsWithIngredients = await Promise.all(
        products.map(product => storage.getProductWithIngredients(product.id))
      );
      
      return res.json(productsWithIngredients);
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductWithIngredients(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      return res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", requireAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      return res.status(201).json(product);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.put("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const productData = insertProductSchema.partial().parse(req.body);
      const updatedProduct = await storage.updateProduct(id, productData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      return res.json(updatedProduct);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.delete("/api/products/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Product Ingredients API routes
  app.post("/api/product-ingredients", requireAdmin, async (req, res) => {
    try {
      const ingredientData = insertProductIngredientSchema.parse(req.body);
      const ingredient = await storage.addIngredientToProduct(ingredientData);
      return res.status(201).json(ingredient);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.put("/api/product-ingredients/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ingredient ID" });
      }
      
      const data = insertProductIngredientSchema.partial().parse(req.body);
      const updated = await storage.updateProductIngredient(id, data);
      
      if (!updated) {
        return res.status(404).json({ message: "Product ingredient not found" });
      }
      
      return res.json(updated);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.delete("/api/product-ingredients/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ingredient ID" });
      }
      
      const success = await storage.removeIngredientFromProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product ingredient not found" });
      }
      
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting product ingredient:", error);
      return res.status(500).json({ message: "Failed to delete product ingredient" });
    }
  });

  // Ingredients API routes
  app.get("/api/ingredients", async (req, res) => {
    try {
      const ingredients = await storage.getIngredients();
      return res.json(ingredients);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
      return res.status(500).json({ message: "Failed to fetch ingredients" });
    }
  });

  app.post("/api/ingredients", requireAdmin, async (req, res) => {
    try {
      const ingredientData = insertIngredientSchema.parse(req.body);
      const ingredient = await storage.createIngredient(ingredientData);
      return res.status(201).json(ingredient);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  // Batch API routes
  app.get("/api/batches", requireAdmin, async (req, res) => {
    try {
      const productId = req.query.productId ? parseInt(req.query.productId as string) : undefined;
      
      if (productId !== undefined) {
        if (isNaN(productId)) {
          return res.status(400).json({ message: "Invalid product ID" });
        }
        
        const batches = await storage.getBatchesByProductId(productId);
        return res.json(batches);
      }
      
      const batches = await storage.getBatches();
      return res.json(batches);
    } catch (error) {
      console.error("Error fetching batches:", error);
      return res.status(500).json({ message: "Failed to fetch batches" });
    }
  });

  app.get("/api/batches/code/:batchCode", async (req, res) => {
    try {
      const batchCode = req.params.batchCode;
      const batch = await storage.getBatchWithDetails(batchCode);
      
      if (!batch) {
        return res.status(404).json({ message: "Batch not found" });
      }
      
      return res.json(batch);
    } catch (error) {
      console.error("Error fetching batch:", error);
      return res.status(500).json({ message: "Failed to fetch batch" });
    }
  });

  app.post("/api/batches", requireAdmin, async (req, res) => {
    try {
      const batchData = insertBatchSchema.parse(req.body);
      const batch = await storage.createBatch(batchData);
      return res.status(201).json(batch);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.put("/api/batches/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid batch ID" });
      }
      
      const batchData = insertBatchSchema.partial().parse(req.body);
      const updatedBatch = await storage.updateBatch(id, batchData);
      
      if (!updatedBatch) {
        return res.status(404).json({ message: "Batch not found" });
      }
      
      return res.json(updatedBatch);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  app.delete("/api/batches/:id", requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid batch ID" });
      }
      
      const success = await storage.deleteBatch(id);
      
      if (!success) {
        return res.status(404).json({ message: "Batch not found" });
      }
      
      return res.status(204).end();
    } catch (error) {
      console.error("Error deleting batch:", error);
      return res.status(500).json({ message: "Failed to delete batch" });
    }
  });

  // Batch Ingredients API routes
  app.post("/api/batch-ingredients", requireAdmin, async (req, res) => {
    try {
      const data = insertBatchIngredientSchema.parse(req.body);
      const batchIngredient = await storage.addIngredientToBatch(data);
      return res.status(201).json(batchIngredient);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  // Research Documents API routes
  app.get("/api/documents", async (req, res) => {
    try {
      const batchId = req.query.batchId ? parseInt(req.query.batchId as string) : undefined;
      const productId = req.query.productId ? parseInt(req.query.productId as string) : undefined;
      const ingredientId = req.query.ingredientId ? parseInt(req.query.ingredientId as string) : undefined;
      
      if (batchId !== undefined) {
        if (isNaN(batchId)) {
          return res.status(400).json({ message: "Invalid batch ID" });
        }
        
        const documents = await storage.getDocumentsByBatchId(batchId);
        return res.json(documents);
      }
      
      if (productId !== undefined) {
        if (isNaN(productId)) {
          return res.status(400).json({ message: "Invalid product ID" });
        }
        
        const documents = await storage.getDocumentsByProductId(productId);
        return res.json(documents);
      }
      
      if (ingredientId !== undefined) {
        if (isNaN(ingredientId)) {
          return res.status(400).json({ message: "Invalid ingredient ID" });
        }
        
        const documents = await storage.getDocumentsByIngredientId(ingredientId);
        return res.json(documents);
      }
      
      const documents = await storage.getResearchDocuments();
      return res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      return res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  app.post("/api/documents", requireAdmin, async (req, res) => {
    try {
      const documentData = insertResearchDocumentSchema.parse(req.body);
      const document = await storage.createResearchDocument(documentData);
      return res.status(201).json(document);
    } catch (error) {
      return handleZodError(error, res);
    }
  });

  // Export data for Shopify
  app.get("/api/export/shopify", requireAdmin, async (req, res) => {
    try {
      const products = await storage.getProducts();
      
      const shopifyData = await Promise.all(
        products.map(async (product) => {
          const withIngredients = await storage.getProductWithIngredients(product.id);
          return {
            handle: product.name.toLowerCase().replace(/\s+/g, '-'),
            title: product.name,
            body_html: product.description,
            vendor: "Crowe Logic",
            product_type: product.healthBenefit,
            tags: [product.healthBenefit, ...withIngredients!.ingredients.map(i => i.ingredient.name)],
            published: product.status === 'active',
            variants: [
              {
                sku: product.sku,
                requires_shipping: true,
                taxable: true,
                inventory_policy: "deny",
                inventory_management: "shopify"
              }
            ],
            images: [
              {
                src: product.image || ""
              }
            ],
            metafields: [
              {
                key: "ingredients",
                value: JSON.stringify(withIngredients!.ingredients.map(i => ({
                  name: i.ingredient.name,
                  percentage: i.percentage,
                  extractType: i.extractType
                }))),
                value_type: "json_string",
                namespace: "custom"
              }
            ]
          };
        })
      );
      
      return res.json(shopifyData);
    } catch (error) {
      console.error("Error exporting Shopify data:", error);
      return res.status(500).json({ message: "Failed to export Shopify data" });
    }
  });

  // Export QR code data
  app.get("/api/export/qr-codes", requireAdmin, async (req, res) => {
    try {
      const batches = await storage.getBatches();
      
      const qrData = batches.map(batch => ({
        batchCode: batch.batchCode,
        qrUrl: `${req.protocol}://${req.get('host')}/batch/${batch.batchCode}`,
      }));
      
      return res.json(qrData);
    } catch (error) {
      console.error("Error exporting QR code data:", error);
      return res.status(500).json({ message: "Failed to export QR code data" });
    }
  });

  // Serve static files from public directory for images
  app.use('/images', express.static('public/images'));

  const httpServer = createServer(app);
  return httpServer;
}
