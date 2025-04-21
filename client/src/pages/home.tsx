import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductFilters from "@/components/product-discovery/product-filters";
import ProductCard from "@/components/product-discovery/product-card";
import BatchLookup from "@/components/batch-transparency/batch-lookup";
import { HeroSection } from "@/components/home/hero-section";
import { EnhancedHero } from "@/components/home/enhanced-hero";
import { ProductDiscoverySection } from "@/components/home/product-discovery-section";
import SectionDivider from "@/components/ui/section-divider";
import { Ingredient, ProductWithIngredients } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Sparkle, 
  Beaker, 
  Clock, 
  Bell, 
  BarChart, 
  Droplets, 
  ShoppingCart 
} from "lucide-react";

export default function Home() {
  const [filters, setFilters] = useState({
    search: "",
    healthBenefit: "",
    ingredient: "",
  });

  const { data: products, isLoading: isProductsLoading } = useQuery<ProductWithIngredients[]>({
    queryKey: ['/api/products'],
  });

  const { data: ingredients, isLoading: isIngredientsLoading } = useQuery<Ingredient[]>({
    queryKey: ['/api/ingredients'],
  });

  const filteredProducts = products?.filter(product => {
    const matchesSearch = filters.search
      ? product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase())
      : true;

    const matchesHealthBenefit = filters.healthBenefit
      ? product.healthBenefit === filters.healthBenefit
      : true;

    const matchesIngredient = filters.ingredient
      ? product.ingredients && product.ingredients.some(item => item.ingredientId.toString() === filters.ingredient)
      : true;

    return matchesSearch && matchesHealthBenefit && matchesIngredient;
  });

  const handleFilterChange = (newFilters: { search: string; healthBenefit: string; ingredient: string }) => {
    setFilters(newFilters);
  };

  return (
    <>
      {/* Enhanced Hero Section */}
      <EnhancedHero />
      
      {/* Section divider */}
      <SectionDivider direction="down" color="#f5f5f5" />
      
      {/* Enhanced Product Discovery Section */}
      <ProductDiscoverySection />
      
      {/* Section divider */}
      <SectionDivider direction="up" color="#f5f5f5" />

      {/* Personalized Formula Section */}
      <section id="personalized-formula" className="py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Your Personalized Wellness Journey</h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Discover the perfect tincture formula for your unique needs, track your usage, and optimize your wellness routine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-8 rounded-sm shadow-md border border-gray-200 transition-transform hover:shadow-lg duration-300">
              <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                <Beaker className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Find Your Formula</h3>
              <p className="text-gray-600 mb-6">
                Our 1oz tincture bottles are crafted with precision. Take our quiz to find your perfect extract match based on your health goals and lifestyle.
              </p>
              <Link href="/recommendation-quiz">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  <Sparkle className="mr-2 h-4 w-4" /> Take the Quiz
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-sm shadow-md border border-gray-200 transition-transform hover:shadow-lg duration-300">
              <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                <Clock className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Track Your Regimen</h3>
              <p className="text-gray-600 mb-6">
                Never miss a dose with our intelligent tracking system. Record your usage patterns and view your consistency over time.
              </p>
              <Link href="/user-dashboard">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  <BarChart className="mr-2 h-4 w-4" /> Track Progress
                </Button>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-sm shadow-md border border-gray-200 transition-transform hover:shadow-lg duration-300">
              <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
                <Bell className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Restock Reminders</h3>
              <p className="text-gray-600 mb-6">
                Get timely notifications when your 1oz tinctures are running low. Reorder directly through our seamless Shopify integration.
              </p>
              <Link href="/user-dashboard?tab=inventory">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Manage Inventory
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-100 to-white p-8 rounded-sm shadow-md border border-gray-200 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/3 flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full blur-lg opacity-30"></div>
                  <div className="relative bg-white rounded-full p-4 border border-gray-200">
                    <Droplets className="h-24 w-24 text-gray-800" />
                  </div>
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Science-Backed Tincture Protocol
                </h3>
                <p className="text-gray-700 mb-4">
                  Each 1oz dropper bottle contains a precise extract formulation developed by Michael Crowe Mycology and produced by Crowe Logic from mushrooms cultivated at Southwest Mushrooms.
                </p>
                <p className="text-gray-700 mb-6">
                  Our intelligent system analyzes your health profile to recommend the perfect dosage and frequency for optimal results.
                </p>
                <Link href="/recommendation-quiz">
                  <Button className="bg-black hover:bg-gray-800 text-white text-lg py-6 px-8">
                    <Sparkle className="mr-2 h-5 w-5" /> Get Your Personalized Protocol
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section divider */}
      <SectionDivider direction="up" color="#1f2937" />

      {/* Batch Transparency Section */}
      <section id="batch-transparency" className="py-12 md:py-20 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-white mb-4">Batch Transparency</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Scan the QR code on your 1oz tincture bottle or enter the batch ID below to view detailed sourcing and testing information.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-sm shadow-md border border-gray-300 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Verify Your Product</h3>
            <p className="text-gray-700 mb-6">
              Every Crowe Logic™ tincture has a unique batch code that allows you to trace its journey from culture to extract.
            </p>
            <BatchLookup />
          </div>
        </div>
      </section>
    </>
  );
}
