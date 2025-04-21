import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Product, ProductWithIngredients } from "@shared/schema";
import { BookOpen, Beaker, Microscope, Droplets, ShoppingCart, Sparkle, Info } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

type ProductCardProps = {
  product: ProductWithIngredients;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Format ingredients list with percentages
  const formatIngredients = () => {
    if (!product.ingredients || product.ingredients.length === 0) {
      return null;
    }
    
    return product.ingredients.map((item) => (
      <div key={item.id} className="flex justify-between items-center py-2 border-b border-amber-200/30 last:border-0">
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-400 mr-2"></div>
          <span className="font-medium">{item.ingredient.name}</span>
          <span className="text-xs text-amber-600 ml-2 italic">{item.ingredient.scientificName}</span>
        </div>
        <span className="font-semibold text-amber-800">{item.percentage}%</span>
      </div>
    ));
  };

  // Format health benefit as title case
  const formatHealthBenefit = (benefit: string) => {
    return benefit.charAt(0).toUpperCase() + benefit.slice(1);
  };
  
  // Generate a color gradient based on product health benefit
  const getBottleColor = () => {
    switch(product.healthBenefit.toLowerCase()) {
      case 'cognitive':
        return 'from-amber-400/90 to-amber-600/90';
      case 'immunity':
        return 'from-amber-300/90 to-amber-500/90';
      case 'energy':
        return 'from-amber-500/90 to-amber-700/90';
      case 'relaxation':
        return 'from-amber-200/90 to-amber-400/90';
      default:
        return 'from-amber-400/90 to-amber-600/90';
    }
  };

  return (
    <Card className="product-card glass-card h-full flex flex-col overflow-hidden relative">
      {/* Background decorative element */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="mycelium-dots opacity-50"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-amber-50/40 to-transparent"></div>
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row h-full">
        {/* Tincture Bottle Visualization */}
        <div 
          className="relative w-full md:w-1/3 p-4 flex items-center justify-center"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative">
            {/* Glow effect */}
            <div className={`absolute -inset-6 bg-amber-500/10 rounded-full blur-xl transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-40'}`}></div>
            
            {/* Bottle container */}
            <div className="relative tincture-bottle tincture-interactive">
              {/* Bottle */}
              <div className={`relative bg-gradient-to-b ${getBottleColor()} w-24 h-40 rounded-lg mx-auto shadow-lg backdrop-blur-sm border border-amber-300/50 overflow-hidden`}>
                {/* Bottle neck */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-4 bg-amber-800/80 rounded-b-lg"></div>
                
                {/* Label */}
                <div className="absolute top-4 left-0 right-0 mx-auto w-20 h-24 bg-white/80 backdrop-filter backdrop-blur-sm rounded-md p-2 flex flex-col items-center justify-center text-center border border-amber-200/50">
                  <div className="mb-1 w-full flex justify-center">
                    <img 
                      src="/images/brand/crowe-logic-transparent.png" 
                      alt="Crowe Logic Formulations" 
                      className="h-5 w-auto object-contain"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-amber-900 block leading-tight">{product.name}</span>
                  <span className="text-[8px] text-amber-700 italic">1 fl oz (30ml)</span>
                  <div className="w-full h-px bg-amber-200 my-1"></div>
                  <span className="text-[7px] text-amber-800">{formatHealthBenefit(product.healthBenefit)}</span>
                </div>
                
                {/* Liquid animation */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-amber-500/50 to-amber-300/30 rounded-b-lg">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-white/20 blur-sm"></div>
                </div>
                
                {/* Dropper */}
                <div className={`absolute -top-12 left-1/2 -translate-x-1/2 w-2 h-16 bg-amber-900/80 rounded-t-full transition-all duration-500 ${isHovered ? 'translate-y-4' : 'translate-y-0'}`}>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-800 rounded-full">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-amber-950/80 rounded-b-full"></div>
                  </div>
                </div>
                
                {/* Droplet effect on hover */}
                {isHovered && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 animate-droplet">
                    <div className="w-2 h-4 bg-amber-500/70 rounded-full blur-sm"></div>
                  </div>
                )}
              </div>
              
              {/* Glow around bottle on hover */}
              <Sparkle className={`absolute -top-2 -right-2 w-6 h-6 text-amber-300 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-50'} bottle-glow`} />
              <Sparkle className={`absolute bottom-1 -left-2 w-4 h-4 text-amber-300 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-50'} bottle-glow`} />
            </div>
          </div>
        </div>
        
        {/* Product Information */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="mb-3 pb-3 border-b border-amber-200/30 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-amber-900 to-amber-600">
                {product.name}
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-600/20 to-amber-400/20 text-amber-800 text-xs font-medium rounded-full">
                  {formatHealthBenefit(product.healthBenefit)}
                </span>
                <span className="px-2 py-0.5 bg-white/40 text-amber-700 text-xs font-medium rounded-full">
                  SKU: {product.sku}
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-center bg-amber-100/50 p-1 rounded-full h-10 w-10">
              <Droplets className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          
          <p className="text-amber-700 text-sm mb-4 leading-relaxed">
            {product.description}
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="bg-white/30 backdrop-blur-sm p-2 rounded-md border border-amber-200/30 flex items-center">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                <Beaker className="h-3 w-3 text-amber-700" />
              </div>
              <span className="text-xs font-medium text-amber-800">Dual Extraction</span>
            </div>
            <div className="bg-white/30 backdrop-blur-sm p-2 rounded-md border border-amber-200/30 flex items-center">
              <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                <Droplets className="h-3 w-3 text-amber-700" />
              </div>
              <span className="text-xs font-medium text-amber-800">1oz Tincture</span>
            </div>
          </div>
          
          {/* Ingredients Accordion */}
          <div className="bg-white/40 backdrop-blur-sm rounded-md border border-amber-200/30 mb-4 overflow-hidden">
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-semibold text-amber-800">Key Ingredients</h4>
                <Info className="h-3 w-3 text-amber-600" />
              </div>
              <div className="max-h-24 overflow-y-auto pr-1 custom-scrollbar">
                {formatIngredients()}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-auto grid grid-cols-2 gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-full tincture-interactive bg-white/50 backdrop-blur-sm border-amber-200/50 text-amber-800 hover:bg-amber-50/80">
                  <BookOpen className="h-4 w-4 mr-2" /> Research
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-md border border-amber-200/40">
                <DialogHeader>
                  <div className="mb-2 flex justify-center">
                    <img 
                      src="/images/brand/crowe-logic-transparent.png" 
                      alt="Crowe Logic Formulations" 
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                  <DialogTitle className="gradient-text text-2xl flex items-center">
                    <Beaker className="mr-2 h-5 w-5" />
                    {product.name}
                  </DialogTitle>
                  <DialogDescription className="text-amber-700">
                    Scientific research supporting our formulation
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <p className="text-amber-900">
                    Our {product.name} is formulated based on scientific research that supports the effectiveness of its key ingredients.
                  </p>
                  
                  <div className="space-y-3 divide-y divide-amber-200/30">
                    {product.ingredients && product.ingredients.length > 0 ? (
                      product.ingredients.map((item) => (
                        <div key={item.id} className="pt-3 first:pt-0">
                          <div className="flex items-center mb-1">
                            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-700 to-amber-500 mr-2"></div>
                            <h5 className="font-medium text-amber-800">{item.ingredient.name}</h5>
                            <span className="text-xs text-amber-600 ml-2 italic">{item.ingredient.scientificName}</span>
                          </div>
                          <p className="text-amber-700 text-sm mt-1">{item.ingredient.description}</p>
                          <Button variant="link" className="text-amber-600 hover:text-amber-800 p-0 h-auto mt-1 text-sm">
                            View published research
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-amber-600">No ingredient information available</div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Link href="/recommendation-quiz">
              <Button className="w-full h-full tincture-interactive bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white">
                <Sparkle className="h-4 w-4 mr-1" /> Find My Formula
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Add a custom style for the droplet animation */}
      <style>{`
        @keyframes droplet {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(10px) scale(0.8); opacity: 0.5; }
          100% { transform: translateY(20px) scale(0.5); opacity: 0; }
        }
        
        .animate-droplet {
          animation: droplet 2s ease-in-out infinite;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(251, 243, 219, 0.1);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(217, 119, 6, 0.2);
          border-radius: 4px;
        }
      `}</style>
    </Card>
  );
}
