import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import BatchInfo from "@/pages/batch-info";
import Admin from "@/pages/admin";
import RecommendationQuiz from "@/pages/recommendation-quiz";
import UserDashboard from "@/pages/user-dashboard";
import { useEffect, useState, useRef } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/batch/:batchCode" component={BatchInfo} />
      <Route path="/admin" component={Admin} />
      <Route path="/recommendation-quiz" component={RecommendationQuiz} />
      <Route path="/user-dashboard" component={UserDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [scrollY, setScrollY] = useState(0);
  
  // Add scroll listener for subtle parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col relative">
          {/* Subtle background elements */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Ambient light circles - subtle and minimal */}
            <div 
              className="fungi-circle w-[800px] h-[800px] -left-[400px] -top-[400px] opacity-30" 
              style={{ transform: `translateY(${scrollY * 0.02}px)` }}
            ></div>
            <div 
              className="fungi-circle w-[600px] h-[600px] -right-[300px] -bottom-[300px] opacity-20" 
              style={{ transform: `translateY(${scrollY * -0.01}px)` }}
            ></div>
          </div>
          
          {/* Main app container */}
          <div className="relative z-10 w-full flex flex-col min-h-screen">
            {/* Clean glass panel */}
            <div className="absolute inset-0 glass-panel rounded-none overflow-hidden -z-10"></div>
            
            {/* App content */}
            <Header />
            <main className="flex-1 container mx-auto p-4 md:p-6">
              <Router />
            </main>
            <Footer />
          </div>
          
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
