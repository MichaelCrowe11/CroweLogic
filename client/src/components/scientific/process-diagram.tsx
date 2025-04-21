import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Beaker, TestTube, ArrowRight, Droplets, MoveRight, BookOpen, Microscope } from 'lucide-react';

interface ProcessStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function ProcessDiagram() {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  
  const steps: ProcessStep[] = [
    {
      icon: <Microscope className="h-6 w-6" />,
      title: "Research & Selection",
      description: "Identify potent mushroom varieties based on scientific research"
    },
    {
      icon: <TestTube className="h-6 w-6" />,
      title: "Cultivation",
      description: "Grow in controlled environment to maximize bioactive compounds"
    },
    {
      icon: <Beaker className="h-6 w-6" />,
      title: "Dual Extraction",
      description: "Water and alcohol extraction to isolate both water and fat-soluble compounds"
    },
    {
      icon: <Droplets className="h-6 w-6" />,
      title: "Formulation",
      description: "Precise blending based on synergistic effects and bioavailability"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Testing & Verification",
      description: "Lab testing ensures potency, purity, and efficacy of final formulation"
    }
  ];
  
  return (
    <div className="w-full py-8">
      <div className="relative">
        {/* Main process line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-amber-200/50 via-amber-300/50 to-amber-200/50 transform -translate-y-1/2 rounded-full"></div>
        
        {/* Flowing particle animation on the line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 transform -translate-y-1/2 overflow-hidden">
          <motion.div 
            className="h-full w-10 bg-gradient-to-r from-transparent via-amber-500/80 to-transparent rounded-full"
            animate={{ 
              x: ["0%", "100%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3,
              ease: "linear",
              times: [0, 0.5, 1]
            }}
          />
        </div>
        
        {/* Process steps */}
        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex flex-col items-center"
              onMouseEnter={() => setActiveStep(index)}
              onMouseLeave={() => setActiveStep(null)}
            >
              {/* Step circle */}
              <motion.div 
                className={`w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center
                border-2 ${activeStep === index ? 'border-amber-500' : 'border-amber-200'} cursor-pointer transition-all`}
                whileHover={{ scale: 1.1 }}
                animate={{ 
                  y: activeStep === index ? -5 : 0,
                  boxShadow: activeStep === index 
                    ? '0 10px 25px -5px rgba(217, 119, 6, 0.3)'
                    : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className={`text-${activeStep === index ? 'amber-600' : 'amber-400'}`}>
                  {step.icon}
                </div>
              </motion.div>
              
              {/* Step description (appears on hover) */}
              <motion.div 
                className="mt-4 text-center w-32"
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: activeStep === index ? 1 : 0,
                  y: activeStep === index ? 0 : 10
                }}
                transition={{ duration: 0.2 }}
              >
                <h4 className="font-semibold text-sm text-amber-800 mb-1">{step.title}</h4>
                <p className="text-xs text-amber-600">{step.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
        
        {/* Connecting arrows between steps */}
        <div className="absolute top-1/2 left-0 right-0 flex justify-between px-24 transform -translate-y-1/2 pointer-events-none">
          {[...Array(steps.length - 1)].map((_, index) => (
            <MoveRight key={index} className="text-amber-300/80 h-5 w-5" />
          ))}
        </div>
      </div>
    </div>
  );
}