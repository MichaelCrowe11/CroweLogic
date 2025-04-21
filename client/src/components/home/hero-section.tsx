import { Button } from "@/components/ui/button";
import { ArrowRight, Beaker, Brain, Microscope, QrCode } from "lucide-react";
import { Link } from "wouter";

export function HeroSection() {
  return (
    <section className="pt-28 md:pt-36 pb-16 md:pb-20 relative overflow-hidden">
      {/* Subtle pattern background */}
      <div className="absolute inset-0 bg-[#FCFCFC] dot-pattern"></div>
      
      {/* Content container */}
      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left column - Text content */}
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-black/5 text-black/70 mb-4 md:mb-6">
              <Brain className="h-4 w-4 mr-2" />
              Precision-crafted medicinal formulations
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Advanced Mushroom <br />
              <span className="text-black">Extracts & Tinctures</span>
            </h1>
            
            <p className="text-gray-700 text-base md:text-lg mb-6 md:mb-8 max-w-xl">
              From culture to extract, we combine Michael Crowe's expertise in mycology with 
              scientific precision to create powerful medicinal mushroom formulations 
              that support your cognitive and immune health.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-8 md:mb-12">
              <Button className="bg-black hover:bg-gray-800 text-white flex items-center gap-2">
                Discover Formulas <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-gray-300 hover:bg-gray-100 flex items-center gap-2">
                <QrCode className="h-4 w-4" /> Scan Batch QR
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/5 rounded-full mb-2">
                  <Microscope className="h-4 w-4 md:h-5 md:w-5 text-black/70" />
                </div>
                <p className="text-xs md:text-sm text-gray-600">Research Backed</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/5 rounded-full mb-2">
                  <svg 
                    className="h-4 w-4 md:h-5 md:w-5 text-black/70"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 2v8.5a2.5 2.5 0 0 1-5 0V8H3.5a2.5 2.5 0 0 0 0 5H10" />
                    <path d="M14 22v-8.5a2.5 2.5 0 0 1 5 0V16h1.5a2.5 2.5 0 0 0 0-5H14" />
                  </svg>
                </div>
                <p className="text-xs md:text-sm text-gray-600">Dual Extraction</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/5 rounded-full mb-2">
                  <Beaker className="h-4 w-4 md:h-5 md:w-5 text-black/70" />
                </div>
                <p className="text-xs md:text-sm text-gray-600">Lab Tested</p>
              </div>
            </div>
          </div>
          
          {/* Right column - Image content */}
          <div className="order-1 lg:order-2 relative mx-auto w-full max-w-md lg:max-w-none">
            {/* Main card display */}
            <div className="aspect-[4/3] relative bg-white rounded-sm shadow-md border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg">
              {/* Product Information */}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-white via-white/95 to-transparent p-4 md:p-6">
                <div className="h-full flex flex-col justify-end">
                  <h3 className="font-bold text-xl md:text-2xl mb-2">Neural Nexus</h3>
                  <p className="text-gray-500 text-sm mb-3 md:mb-4">Cognitive Support Formula</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
                    <span className="text-xs bg-black/5 px-2 py-1 rounded-sm text-black/70">Lion's Mane (50%)</span>
                    <span className="text-xs bg-black/5 px-2 py-1 rounded-sm text-black/70">Blue Oyster (20%)</span>
                    <span className="text-xs bg-black/5 px-2 py-1 rounded-sm text-black/70">Reishi (15%)</span>
                    <span className="text-xs bg-black/5 px-2 py-1 rounded-sm text-black/70">Shiitake (15%)</span>
                  </div>
                
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-gray-600">Batch:</span>
                      <span className="font-medium">NX2204A</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-gray-600">Format:</span>
                      <span className="font-medium">Dual Extract | 1 fl oz</span>
                    </div>
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-gray-600">Crafted by:</span>
                      <span className="font-medium">Michael Crowe</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="/images/hero/michael-harvesting-2.png" 
                  alt="Michael Crowe harvesting medicinal mushrooms" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Mushroom Harvesting Inset - Hidden on mobile, visible on tablet+ */}
            <div className="hidden md:block absolute -left-4 top-1/3 transform -translate-y-1/2 bg-white p-2 rounded-sm shadow-md border border-gray-200">
              <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-sm overflow-hidden">
                <img 
                  src="/images/hero/michael-harvesting-1.png" 
                  alt="Michael Crowe harvesting medicinal mushrooms" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Research Note - Hidden on mobile, visible on tablet+ */}
            <div className="hidden md:block absolute -right-4 bottom-1/4 bg-white p-3 rounded-sm shadow-md border border-gray-200 max-w-[180px]">
              <div className="text-sm text-gray-900 font-medium">
                "Our fresh cultivation process ensures maximum bioactive compounds in every formulation."
              </div>
              <div className="text-xs text-gray-500 mt-2">
                - Michael Crowe
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}