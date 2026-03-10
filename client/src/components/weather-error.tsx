import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface WeatherErrorProps {
  message: string;
  onRetry: () => void;
}

export function WeatherError({ message, onRetry }: WeatherErrorProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }} 
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
      transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      className="w-full max-w-lg mx-auto mt-24"
    >
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-black/40 backdrop-blur-2xl border border-red-500/20 p-10 rounded-[2.5rem] flex flex-col items-center text-center shadow-2xl">
          
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
          >
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </motion.div>

          <h2 className="font-display text-3xl text-white mb-4">Atmospheric Disruption</h2>
          <p className="text-zinc-400 font-sans leading-relaxed mb-10 max-w-sm">
            {message || "Telemetry from meteorological arrays could not be retrieved. Please verify the connection sequence."}
          </p>

          <button 
            onClick={onRetry}
            className="group relative px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full font-sans tracking-widest uppercase text-xs text-white transition-all duration-300 overflow-hidden flex items-center gap-3"
          >
            <span className="relative z-10">Re-establish Link</span>
            <RefreshCcw className="w-4 h-4 relative z-10 group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
