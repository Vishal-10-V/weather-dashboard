import { motion } from "framer-motion";

export function WeatherSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-20"
    >
      <div className="w-48 h-6 bg-white/5 rounded-full overflow-hidden relative mb-12">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        />
      </div>
      
      <div className="w-64 h-32 bg-white/5 rounded-[3rem] overflow-hidden relative mb-8">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.2 }}
        />
      </div>
      
      <div className="w-32 h-8 bg-white/5 rounded-full overflow-hidden relative mb-24">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.4 }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl px-6">
        {[0, 1].map((i) => (
          <div key={i} className="h-32 glass-panel rounded-3xl overflow-hidden relative">
             <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear", delay: i * 0.3 }}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
