import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, RotateCcw } from "lucide-react";
import { healthBenefits } from "@shared/schema";

type ProductFiltersProps = {
  onFilterChange: (filters: { 
    search: string;
    healthBenefit: string;
    ingredient: string;
  }) => void;
  ingredients: { id: number; name: string }[];
};

export default function ProductFilters({ onFilterChange, ingredients }: ProductFiltersProps) {
  const [search, setSearch] = useState("");
  const [healthBenefit, setHealthBenefit] = useState("all");
  const [ingredient, setIngredient] = useState("all");

  useEffect(() => {
    onFilterChange({ search, healthBenefit, ingredient });
  }, [search, healthBenefit, ingredient, onFilterChange]);

  // Convert benefit string to title case for display
  const formatBenefit = (benefit: string) => {
    if (benefit === "all") return "All Health Benefits";
    return benefit.charAt(0).toUpperCase() + benefit.slice(1);
  };

  return (
    <div>
      <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center">
        <Filter className="mr-2 h-5 w-5 text-amber-600" />
        Find Your Formula
      </h3>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products..."
              className="pl-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-4 w-4 text-amber-500" />
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Select value={healthBenefit} onValueChange={setHealthBenefit}>
            <SelectTrigger className="min-w-[200px] border-amber-300 text-amber-800">
              <SelectValue placeholder="All Health Benefits" />
            </SelectTrigger>
            <SelectContent className="bg-amber-50">
              <SelectItem value="all" className="text-amber-800">All Health Benefits</SelectItem>
              {healthBenefits.map((benefit) => (
                <SelectItem key={benefit} value={benefit} className="text-amber-800">
                  {formatBenefit(benefit)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={ingredient} onValueChange={setIngredient}>
            <SelectTrigger className="min-w-[200px] border-amber-300 text-amber-800">
              <SelectValue placeholder="All Ingredients" />
            </SelectTrigger>
            <SelectContent className="bg-amber-50">
              <SelectItem value="all" className="text-amber-800">All Ingredients</SelectItem>
              {ingredients.map((ing) => (
                <SelectItem key={ing.id} value={ing.id.toString()} className="text-amber-800">
                  {ing.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200"
            onClick={() => {
              setSearch("");
              setHealthBenefit("all");
              setIngredient("all");
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
