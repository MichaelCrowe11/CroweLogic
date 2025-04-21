import React from 'react';
import { motion } from 'framer-motion';
import ProductShowcase from '../product-discovery/product-showcase';

export function ProductDiscoverySection() {
  return (
    <section id="product-discovery" className="py-16 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-50/50 to-transparent pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-50/50 to-transparent pointer-events-none"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-100/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-amber-100/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-amber-900 mb-3">
              Discover Our Formulations
            </h2>
            <p className="text-amber-700">
              Each Crowe Logic™ formula is crafted with scientific precision, featuring dual-extracted 
              mushroom tinctures designed to optimize specific aspects of your health and wellness journey.
            </p>
          </div>
          
          <ProductShowcase />
        </motion.div>
      </div>
    </section>
  );
}