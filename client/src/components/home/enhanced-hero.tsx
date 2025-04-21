import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ChevronRight, Beaker, Microscope, Leaf, ArrowRight } from 'lucide-react';

export function EnhancedHero() {
  return (
    <section className="relative py-12 overflow-hidden bg-gradient-to-br from-amber-50 to-white">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-50/30 -skew-x-12 transform origin-top-right"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 rounded-full bg-amber-100/40 blur-xl"></div>
      <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-amber-200/20 blur-xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-start">
          {/* Left column: Text content */}
          <div className="lg:w-1/2 lg:pr-12 mb-10 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-amber-900 leading-tight">
                From Culture<br />to Extract
              </h1>
              
              <p className="text-lg md:text-xl text-amber-800 mb-8 max-w-xl">
                Crowe Logic™ transforms medicinal mushrooms into precision-crafted 
                tinctures harnessing the full spectrum of bioactive compounds for optimal health benefits.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 mb-12">
                <Link href="/recommendation-quiz">
                  <Button size="lg" className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-sm">
                    Find Your Formula <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                
                <Link href="/batch-transparency">
                  <Button size="lg" variant="outline" className="border-amber-300 text-amber-800 hover:bg-amber-50/50">
                    Batch Transparency
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start">
                  <div className="mr-3 mt-1 p-2 bg-amber-100/50 rounded-full">
                    <Beaker className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-900 mb-1">Scientific Formulation</h3>
                    <p className="text-amber-700 text-sm">Research-backed medicinal mushroom extracts</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1 p-2 bg-amber-100/50 rounded-full">
                    <Microscope className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-900 mb-1">Dual Extraction</h3>
                    <p className="text-amber-700 text-sm">Preserves both water and alcohol-soluble compounds</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="mr-3 mt-1 p-2 bg-amber-100/50 rounded-full">
                    <Leaf className="h-5 w-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-900 mb-1">Sustainable</h3>
                    <p className="text-amber-700 text-sm">Locally grown organic mushrooms</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right column: Images and visual elements */}
          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-md overflow-hidden shadow-xl border border-amber-100">
                <img 
                  src="/images/hero/tincture-bottles.png" 
                  alt="Crowe Logic Tincture Bottles" 
                  className="w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-900/80 to-transparent text-white p-6">
                  <h3 className="text-xl font-semibold mb-2">1oz Tincture Bottles</h3>
                  <p className="text-sm text-amber-100">Precision-dosed medicinal mushroom extracts</p>
                </div>
              </div>
              
              {/* Scientific element overlay */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white p-2 rounded-md shadow-lg border border-amber-100 transform rotate-6 z-20">
                <img
                  src="/images/scientific/microscope-view.png"
                  alt="Microscopic View of Mushroom Mycelium"
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute bottom-2 right-2 bg-amber-100 text-amber-900 text-xs px-2 py-1 rounded">
                  Mycelium
                </div>
              </div>
              
              {/* Brand identity element */}
              <div className="absolute -top-4 -left-4 bg-white p-3 rounded-md shadow-lg border border-amber-100 z-20">
                <img
                  src="/images/brand/crowe-logic-mark.png" 
                  alt="Crowe Logic Logo"
                  className="w-24 h-24 object-contain"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Scientific-themed decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-amber-100/80 via-transparent to-amber-100/80"></div>
      <div className="absolute -bottom-1 left-0 right-0 h-[1px] bg-amber-200/50"></div>
    </section>
  );
}