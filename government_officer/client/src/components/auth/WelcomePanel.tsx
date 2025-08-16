import { motion } from "framer-motion";
import SLTDA_logo from "@/assets/SLTDA_logo.png";

export const WelcomePanel = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="flex-1 p-12 flex flex-col justify-center"
    >
      <div className="mb-8">
        <div className="w-64 h-64 mx-auto mb-8 relative">
          <img
            src={SLTDA_logo}
            alt="SLTDA logo"
            className="w-64 h-64 rounded-full object-cover mx-auto"
          />
        </div>
      </div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-5xl font-bold text-government-800 mb-6"
      >
        Welcome back
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-xl text-government-600 mb-8"
      >
        Review, approve, and safeguard tourism standards with confidence.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-status-approved flex items-center justify-center">
            <span className="text-white text-sm font-semibold leading-none">✓</span>
          </div>
          <span className="text-government-700">Pre-filtered review queue</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-status-approved flex items-center justify-center">
            <span className="text-white text-sm font-semibold leading-none">✓</span>
          </div>
          <span className="text-government-700">Consolidated audit reports</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-status-approved flex items-center justify-center">
            <span className="text-white text-sm font-semibold leading-none">✓</span>
          </div>
          <span className="text-government-700">Integrity flags & analytics</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
