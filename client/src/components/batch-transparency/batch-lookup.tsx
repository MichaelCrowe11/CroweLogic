import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { QrCode, Search, Loader2, Shield, Beaker, Droplets, ScanLine, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";

const batchCodeSchema = z.object({
  batchCode: z.string()
    .min(6, { message: "Batch code must be at least 6 characters" })
    .max(20, { message: "Batch code must be at most 20 characters" })
    .regex(/^[A-Z0-9-]+$/, { message: "Batch code can only contain uppercase letters, numbers, and hyphens" })
});

type BatchFormValues = z.infer<typeof batchCodeSchema>;

export default function BatchLookup() {
  const [isLoading, setIsLoading] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [_, setLocation] = useLocation();
  const scannerRef = useRef<HTMLDivElement>(null);

  const form = useForm<BatchFormValues>({
    resolver: zodResolver(batchCodeSchema),
    defaultValues: {
      batchCode: ""
    }
  });

  // Handle batch code submission
  const onSubmit = async (data: BatchFormValues) => {
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      setLocation(`/batch/${data.batchCode}`);
    }, 800);
  };

  // Simulate QR scanner animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isScannerOpen) {
      interval = setInterval(() => {
        setScanProgress((prev) => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              handleScanComplete();
            }, 500);
            return 100;
          }
          return newProgress;
        });
      }, 30);
    } else {
      setScanProgress(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScannerOpen]);

  // Handle QR scanner toggle
  const toggleScanner = () => {
    setIsScannerOpen(!isScannerOpen);
  };

  // Handle successful scan
  const handleScanComplete = () => {
    const batchCode = "CL-2025-1OZ"; // In a real app, this would come from the QR scanner
    form.setValue("batchCode", batchCode);
    
    // Add a slight delay for better UX
    setTimeout(() => {
      setIsScannerOpen(false);
      form.handleSubmit(onSubmit)();
    }, 500);
  };

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="mycelium-dots opacity-30"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-100/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-amber-200/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Verified batch badges */}
      <div className="relative z-10 flex justify-center items-center gap-3 mb-6">
        <Badge variant="outline" className="px-3 py-1 border-amber-200 flex items-center gap-1 bg-white/50 backdrop-blur-sm shadow-sm">
          <BadgeCheck className="h-3.5 w-3.5 text-green-600" />
          <span className="text-amber-900 text-xs font-medium">Verified Origin</span>
        </Badge>
        <Badge variant="outline" className="px-3 py-1 border-amber-200 flex items-center gap-1 bg-white/50 backdrop-blur-sm shadow-sm">
          <Shield className="h-3.5 w-3.5 text-amber-600" />
          <span className="text-amber-900 text-xs font-medium">Lab Tested</span>
        </Badge>
        <Badge variant="outline" className="px-3 py-1 border-amber-200 flex items-center gap-1 bg-white/50 backdrop-blur-sm shadow-sm">
          <Beaker className="h-3.5 w-3.5 text-amber-600" />
          <span className="text-amber-900 text-xs font-medium">Small Batch</span>
        </Badge>
      </div>
      
      <div className="relative z-10 flex flex-col space-y-6">
        {/* Title */}
        <div className="text-center mb-2">
          <h3 className="text-lg font-semibold text-amber-800">Verify Your 1oz Tincture</h3>
          <p className="text-amber-700 text-sm">Each batch has a unique code that reveals its journey</p>
        </div>
        
        {/* Input form */}
        <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-amber-200/50 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="batchCode"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex gap-2">
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Enter batch code (e.g., CL-2025-1OZ)" 
                            {...field}
                            className="bg-white/80 border-amber-300 focus:border-amber-500 focus:ring-amber-500 h-12 pl-10"
                          />
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500">
                            <QrCode className="h-5 w-5" />
                          </div>
                        </div>
                      </FormControl>
                      <Button 
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white min-w-[100px] shadow-md"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            Verify
                          </>
                        )}
                      </Button>
                    </div>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        
        {/* QR Scanner */}
        <div className="relative">
          {isScannerOpen ? (
            <div 
              ref={scannerRef}
              className="w-full aspect-square border-2 border-amber-400 rounded-lg overflow-hidden bg-black/80 relative tincture-interactive" 
            >
              {/* Scanner animation */}
              <div 
                className="absolute left-0 w-full h-0.5 bg-amber-400 shadow-[0_0_5px_rgba(217,119,6,0.7)]" 
                style={{ 
                  top: `${scanProgress}%`,
                  transition: 'top 0.1s ease-out'
                }}
              ></div>
              
              {/* Scanning corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-400"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-400"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-400"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-400"></div>
              
              {/* Scan effect */}
              <div className="absolute inset-4 flex items-center justify-center">
                <ScanLine className="h-24 w-24 text-amber-300/70 animate-pulse" />
              </div>
              
              {/* Target example */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border border-dashed border-amber-300/50 rounded-md p-2 flex items-center justify-center">
                  <div className="text-amber-300/90 text-xs text-center font-mono">
                    CL-2025-1OZ
                  </div>
                </div>
              </div>
              
              {/* Helper text */}
              <div className="absolute bottom-4 left-0 right-0 text-center text-white text-xs">
                {scanProgress < 100 ? "Scanning..." : "Batch code detected!"}
              </div>
              
              {/* Close scanner button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 text-white hover:bg-white/20 p-1 h-auto w-auto" 
                onClick={() => setIsScannerOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>
          ) : (
            <Button 
              onClick={toggleScanner}
              variant="outline"
              className="w-full py-8 tincture-interactive bg-gradient-to-br from-amber-100/80 to-amber-50/80 border border-amber-300/50 hover:bg-amber-100/90 hover:border-amber-400/60 shadow-md"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-2 relative">
                  <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping opacity-75"></div>
                  <QrCode className="h-6 w-6 text-amber-700" />
                </div>
                <span className="text-amber-900 font-medium">Scan QR Code on Your Bottle</span>
                <span className="text-amber-600 text-xs mt-1">Position the QR code within the camera frame</span>
              </div>
            </Button>
          )}
        </div>
        
        {/* Info cards */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-amber-200/40 flex flex-col items-center text-center">
            <Droplets className="h-5 w-5 text-amber-600 mb-1" />
            <h4 className="text-sm font-medium text-amber-800">Authenticity</h4>
            <p className="text-xs text-amber-700">Verify your tincture is genuine</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-3 rounded-lg border border-amber-200/40 flex flex-col items-center text-center">
            <Shield className="h-5 w-5 text-amber-600 mb-1" />
            <h4 className="text-sm font-medium text-amber-800">Traceability</h4>
            <p className="text-xs text-amber-700">See the journey from spore to extract</p>
          </div>
        </div>
        
        <div className="text-xs text-amber-700 italic text-center">
          Every 1oz tincture bottle has a unique batch code on the label or can be scanned via QR code
        </div>
      </div>
    </div>
  );
}