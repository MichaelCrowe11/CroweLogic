import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, ZoomIn, ZoomOut, Microscope } from 'lucide-react';

interface MicroscopicViewProps {
  productName: string;
  description: string;
  className?: string;
}

export function MicroscopicView({ productName, description, className = '' }: MicroscopicViewProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate semi-random mycelium structure patterns
  const generateMyceliumPatterns = () => {
    const paths = [];
    const branchCount = 8;
    
    for (let i = 0; i < branchCount; i++) {
      const startAngle = (i * Math.PI * 2) / branchCount;
      const length = 30 + Math.random() * 40;
      const segments = 5 + Math.floor(Math.random() * 5);
      
      let x = 50;
      let y = 50;
      let path = `M ${x} ${y}`;
      let angle = startAngle;
      
      for (let j = 0; j < segments; j++) {
        const segmentLength = length / segments;
        const randomOffset = Math.random() * 15 - 7.5;
        angle += randomOffset * (Math.PI / 180);
        
        x += Math.cos(angle) * segmentLength;
        y += Math.sin(angle) * segmentLength;
        
        path += ` L ${x} ${y}`;
        
        // Add random branches with 30% probability
        if (Math.random() < 0.3 && j > 0) {
          const branchAngle = angle + (Math.random() * Math.PI / 2 - Math.PI / 4);
          const branchLength = segmentLength * (0.4 + Math.random() * 0.3);
          const branchX = x + Math.cos(branchAngle) * branchLength;
          const branchY = y + Math.sin(branchAngle) * branchLength;
          
          path += ` M ${x} ${y} L ${branchX} ${branchY} M ${x} ${y}`;
        }
      }
      
      paths.push(path);
    }
    
    return paths;
  };
  
  const myceliumPaths = useRef(generateMyceliumPatterns());
  
  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Zoom handlers
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 1));
  };
  
  useEffect(() => {
    const handleMouseLeave = () => {
      setIsDragging(false);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);
  
  return (
    <div className={`rounded-lg overflow-hidden bg-white/50 backdrop-blur-sm shadow-md border border-amber-100 ${className}`}>
      <div className="p-4 border-b border-amber-100 flex justify-between items-center">
        <div className="flex items-center">
          <Microscope className="h-5 w-5 text-amber-700 mr-2" />
          <h3 className="text-amber-900 font-medium text-lg">{productName} Microscopic View</h3>
        </div>
        <div className="flex items-center">
          <button 
            onClick={handleZoomOut}
            className="p-1.5 rounded-md text-amber-700 hover:bg-amber-50 transition-colors"
            disabled={zoom <= 1}
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <div className="mx-2 text-xs text-amber-600 font-mono bg-amber-50 px-2 py-0.5 rounded">
            {Math.round(zoom * 100)}%
          </div>
          <button 
            onClick={handleZoomIn}
            className="p-1.5 rounded-md text-amber-700 hover:bg-amber-50 transition-colors"
            disabled={zoom >= 3}
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className={`relative w-full h-64 overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <div className="absolute inset-0 bg-amber-50/50">
          {/* Grid pattern */}
          <svg width="100%" height="100%" className="absolute inset-0 opacity-10">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          
          {/* Circular measurement markers */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              <motion.div 
                className="w-40 h-40 rounded-full border border-dashed border-amber-300/40 absolute"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`
                }}
              />
              <motion.div 
                className="w-80 h-80 rounded-full border border-dashed border-amber-300/30 absolute"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`
                }}
              />
              <motion.div 
                className="w-120 h-120 rounded-full border border-dashed border-amber-300/20 absolute"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`
                }}
              />
            </div>
          </div>
          
          {/* Mycelium structure */}
          <motion.svg 
            width="100%" 
            height="100%" 
            viewBox="0 0 100 100" 
            className="absolute inset-0 pointer-events-none"
            animate={{ opacity: [0.7, 0.9, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`
            }}
          >
            {myceliumPaths.current.map((path, index) => (
              <g key={index}>
                {/* Shadow/glow effect */}
                <path 
                  d={path} 
                  stroke="rgba(217, 119, 6, 0.1)" 
                  strokeWidth="2.5" 
                  fill="none" 
                  strokeLinecap="round"
                  strokeDasharray="1"
                />
                {/* Main path */}
                <path 
                  d={path} 
                  stroke="rgba(217, 119, 6, 0.6)" 
                  strokeWidth="0.7" 
                  fill="none" 
                  strokeLinecap="round"
                />
                {/* Animated highlight */}
                <motion.path 
                  d={path} 
                  stroke="rgba(217, 119, 6, 0.8)" 
                  strokeWidth="0.3" 
                  fill="none" 
                  strokeLinecap="round"
                  strokeDasharray="5 10"
                  animate={{ strokeDashoffset: [0, 15] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
              </g>
            ))}
          </motion.svg>
          
          {/* Interactive lens effect */}
          <div 
            className="absolute rounded-full pointer-events-none shadow-inner"
            style={{
              width: '120px',
              height: '120px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: 'inset 0 0 20px rgba(217, 119, 6, 0.1)',
              border: '1px solid rgba(217, 119, 6, 0.2)',
              background: 'radial-gradient(circle, transparent, rgba(217, 119, 6, 0.05))'
            }}
          />
        </div>
      </div>
      
      <div className="p-4 text-sm text-amber-700 max-h-32 overflow-auto">
        <p>{description}</p>
        <div className="mt-3 flex items-center">
          <Search className="h-3.5 w-3.5 text-amber-500 mr-1.5" />
          <span className="text-xs text-amber-500">Drag to explore, use the zoom controls for detailed view</span>
        </div>
      </div>
    </div>
  );
}