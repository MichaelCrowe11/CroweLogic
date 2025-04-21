import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Health Benefit enum for consistent type usage
export const healthBenefits = [
  "cognitive", 
  "immune",
  "mood",
  "energy",
  "relaxation"
] as const;

export type HealthBenefit = typeof healthBenefits[number];

// Products Table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  sku: text("sku").notNull().unique(),
  healthBenefit: text("health_benefit").notNull(),
  image: text("image"),
  status: text("status").default("active").notNull(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

// Ingredients Table
export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  scientificName: text("scientific_name"),
  description: text("description"),
});

export const insertIngredientSchema = createInsertSchema(ingredients).omit({
  id: true,
});

// Product Ingredients Junction Table
export const productIngredients = pgTable("product_ingredients", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  ingredientId: integer("ingredient_id").notNull(),
  percentage: integer("percentage").notNull(),
  extractType: text("extract_type"),
});

export const insertProductIngredientSchema = createInsertSchema(productIngredients).omit({
  id: true,
});

// Batches Table
export const batches = pgTable("batches", {
  id: serial("id").primaryKey(),
  batchCode: text("batch_code").notNull().unique(),
  productId: integer("product_id").notNull(),
  productionDate: timestamp("production_date").notNull(),
  alcoholPercentage: integer("alcohol_percentage"),
  organicCertification: text("organic_certification"),
  notes: text("notes"),
});

export const insertBatchSchema = createInsertSchema(batches).omit({
  id: true,
});

// Batch Ingredients Table
export const batchIngredients = pgTable("batch_ingredients", {
  id: serial("id").primaryKey(),
  batchId: integer("batch_id").notNull(),
  ingredientId: integer("ingredient_id").notNull(),
  percentage: integer("percentage").notNull(),
  extractType: text("extract_type").notNull(),
  extractionRatio: text("extraction_ratio"),
  harvestDate: timestamp("harvest_date"),
});

export const insertBatchIngredientSchema = createInsertSchema(batchIngredients).omit({
  id: true,
});

// Research Documents Table
export const researchDocuments = pgTable("research_documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(), // certificate, lab_result, research
  ingredientId: integer("ingredient_id"),
  productId: integer("product_id"),
  batchId: integer("batch_id"),
});

export const insertResearchDocumentSchema = createInsertSchema(researchDocuments).omit({
  id: true,
});

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Type definitions
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Ingredient = typeof ingredients.$inferSelect;
export type InsertIngredient = z.infer<typeof insertIngredientSchema>;

export type ProductIngredient = typeof productIngredients.$inferSelect;
export type InsertProductIngredient = z.infer<typeof insertProductIngredientSchema>;

export type Batch = typeof batches.$inferSelect;
export type InsertBatch = z.infer<typeof insertBatchSchema>;

export type BatchIngredient = typeof batchIngredients.$inferSelect;
export type InsertBatchIngredient = z.infer<typeof insertBatchIngredientSchema>;

export type ResearchDocument = typeof researchDocuments.$inferSelect;
export type InsertResearchDocument = z.infer<typeof insertResearchDocumentSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Extended product with ingredients
export type ProductWithIngredients = Product & {
  ingredients: (ProductIngredient & { ingredient: Ingredient })[];
};

// Extended batch with product and ingredients
export type BatchWithDetails = Batch & {
  product: Product;
  ingredients: (BatchIngredient & { ingredient: Ingredient })[];
  documents: ResearchDocument[];
};
