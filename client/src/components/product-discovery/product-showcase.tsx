import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import { Link } from 'wouter';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Shield, Heart, MoonStar, Sparkles, Star, ChevronRight, ArrowRight, Activity, Beaker, PlusCircle } from 'lucide-react';
import './product-showcase.css';

export default function ProductShowcase() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [hoverProduct, setHoverProduct] = useState<number | null>(null);
  
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });
  
  // Health benefit icon mapping
  const getBenefitIcon = (benefit: string) => {
    switch(benefit) {
      case 'cognitive':
        return <Brain className="h-5 w-5 text-amber-600" />;
      case 'immune':
        return <Shield className="h-5 w-5 text-amber-600" />;
      case 'energy':
        return <Heart className="h-5 w-5 text-amber-600" />;
      case 'relaxation':
        return <MoonStar className="h-5 w-5 text-amber-600" />;
      case 'mood':
        return <Sparkles className="h-5 w-5 text-amber-600" />;
      default:
        return <Star className="h-5 w-5 text-amber-600" />;
    }
  };
  
  // Health benefit color mapping
  const getBenefitColor = (benefit: string) => {
    switch(benefit) {
      case 'cognitive':
        return 'bg-gradient-to-r from-amber-500/20 to-amber-300/20 text-amber-800';
      case 'immune':
        return 'bg-gradient-to-r from-emerald-500/20 to-emerald-300/20 text-emerald-800';
      case 'energy':
        return 'bg-gradient-to-r from-rose-500/20 to-rose-300/20 text-rose-800';
      case 'relaxation':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-300/20 text-blue-800';
      case 'mood':
        return 'bg-gradient-to-r from-purple-500/20 to-purple-300/20 text-purple-800';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-300/20 text-gray-800';
    }
  };
  
  // Format health benefit for display
  const formatHealthBenefit = (benefit: string) => {
    return benefit.charAt(0).toUpperCase() + benefit.slice(1);
  };
  
  // Filter products based on selected tab
  const filteredProducts = products?.filter(product => {
    if (activeTab === 'all') return true;
    if (activeTab === 'coming_soon') return product.status === 'coming_soon';
    return product.healthBenefit === activeTab && product.status === 'active';
  });

  if (isLoading) return (
    <div className="w-full py-20 flex justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-48 h-6 bg-amber-200/50 rounded mb-4"></div>
        <div className="w-64 h-4 bg-amber-100/50 rounded"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="text-center py-10 text-gray-500">
      Error loading products. Please try again later.
    </div>
  );

  if (!products || products.length === 0) return (
    <div className="text-center py-10 text-gray-500">
      No products available.
    </div>
  );

  return (
    <div className="w-full py-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3 text-amber-900">Crowe Logic™ Formulations</h2>
        <p className="text-amber-700 max-w-3xl mx-auto">
          Expertly crafted medicinal mushroom tinctures combining traditional wisdom with modern scientific research.
          Each formula is designed to target specific health benefits through our proprietary dual-extraction process.
        </p>
      </div>
      
      <Tabs defaultValue="all" className="w-full mb-8" onValueChange={setActiveTab} value={activeTab}>
        <div className="flex justify-center">
          <TabsList className="bg-amber-50/50 border border-amber-100/50 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-amber-900">
              All Products
            </TabsTrigger>
            <TabsTrigger value="cognitive" className="data-[state=active]:bg-white data-[state=active]:text-amber-900">
              Cognitive
            </TabsTrigger>
            <TabsTrigger value="immune" className="data-[state=active]:bg-white data-[state=active]:text-amber-900">
              Immune
            </TabsTrigger>
            <TabsTrigger value="energy" className="data-[state=active]:bg-white data-[state=active]:text-amber-900">
              Energy
            </TabsTrigger>
            <TabsTrigger value="relaxation" className="data-[state=active]:bg-white data-[state=active]:text-amber-900">
              Relaxation
            </TabsTrigger>
            <TabsTrigger value="coming_soon" className="data-[state=active]:bg-white data-[state=active]:text-amber-900">
              Coming Soon
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto max-w-7xl">
            {filteredProducts?.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="h-full"
                onMouseEnter={() => setHoverProduct(product.id)}
                onMouseLeave={() => setHoverProduct(null)}
              >
                <Card className="h-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-amber-100/60 bg-white/70 backdrop-blur-sm">
                  <div className="h-full flex flex-col">
                    <div className="relative p-4 pb-0">
                      <Badge 
                        variant="outline" 
                        className={`absolute top-6 right-6 ${product.status === 'coming_soon' ? 'bg-amber-100/50 text-amber-800 border-amber-200' : getBenefitColor(product.healthBenefit)}`}
                      >
                        {product.status === 'coming_soon' ? 'Coming Soon' : formatHealthBenefit(product.healthBenefit)}
                      </Badge>
                      
                      <div className="flex items-center mb-3">
                        <div className="mr-2 p-1.5 bg-amber-50 rounded-full">
                          {getBenefitIcon(product.healthBenefit)}
                        </div>
                        <h3 className="text-lg font-bold text-amber-900">{product.name}</h3>
                      </div>
                      
                      <p className="text-amber-700 text-sm mb-4">{product.description}</p>
                    </div>
                    
                    <div className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-5">
                        <div className="mycelium-dots h-full"></div>
                      </div>
                      
                      {product.image ? (
                        <div className="relative z-10 transform transition-all duration-500" 
                          style={{ 
                            transform: hoverProduct === product.id ? 'scale(1.05)' : 'scale(1)'
                          }}
                        >
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="h-48 w-auto object-contain mx-auto"
                          />
                        </div>
                      ) : (
                        <div className="w-full aspect-square bg-amber-50 rounded-lg flex items-center justify-center">
                          <Beaker className="h-16 w-16 text-amber-200" />
                        </div>
                      )}
                      
                      {/* Radial glow effect on hover */}
                      {hoverProduct === product.id && (
                        <motion.div 
                          className="absolute inset-0 bg-radial-glow pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </div>
                    
                    <div className="p-4 pt-2 border-t border-amber-100/50 flex justify-between items-center bg-amber-50/30">
                      <div className="text-xs text-amber-600 font-medium">
                        SKU: {product.sku}
                      </div>
                      
                      {product.status === 'coming_soon' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-amber-700 border-amber-200 hover:bg-amber-50"
                        >
                          <PlusCircle className="mr-1 h-3.5 w-3.5" />
                          Get Notified
                        </Button>
                      ) : (
                        <Link href={`/product/${product.id}`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-amber-700 border-amber-200 hover:bg-amber-50"
                          >
                            Details <ChevronRight className="ml-1 h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center mt-10">
        <Link href="/recommendation-quiz">
          <Button className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-sm px-6">
            Find Your Perfect Formula <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      {/* Styles injected manually */}
    </div>
  );
}