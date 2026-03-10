import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudRain, Wind, Droplets, Sun, Moon, Cloud, Eye, Gauge, Zap, Thermometer } from "lucide-react";
import { useWeather } from "@/hooks/use-weather";
import { WeatherNav } from "@/components/weather-nav";
import { WeatherSkeleton } from "@/components/weather-skeleton";
import { WeatherError } from "@/components/weather-error";

export default function Dashboard() {
  const [simulateFail, setSimulateFail] = useState(false);
  const [lat, setLat] = useState<number | undefined>(undefined);
  const [lon, setLon] = useState<number | undefined>(undefined);
  const [locationName, setLocationName] = useState<string | undefined>(undefined);
  const { data, isLoading, error, refetch } = useWeather({ simulateFail, lat, lon, location: locationName });

  const renderWeatherIcon = (condition: string, isDay: boolean) => {
    const iconProps = { className: "w-8 h-8 text-zinc-400", strokeWidth: 1.5 };
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) return <CloudRain {...iconProps} />;
    if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) return <Cloud {...iconProps} />;
    if (lowerCondition.includes('fog')) return <Cloud {...iconProps} className="w-8 h-8 text-zinc-500" />;
    if (lowerCondition.includes('snow')) return <Cloud {...iconProps} className="w-8 h-8 text-blue-100" />;
    return isDay ? <Sun {...iconProps} className="w-8 h-8 text-amber-200" /> : <Moon {...iconProps} />;
  };

  const DetailCard = ({ 
    icon: Icon, 
    label, 
    value, 
    unit,
    delay,
    accentColor = "text-blue-200"
  }: any) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="glass-panel glass-panel-hover rounded-[2rem] p-8 flex items-center justify-between group"
    >
      <div className="flex flex-col">
        <span className="font-sans text-xs tracking-widest uppercase text-zinc-500 mb-2">{label}</span>
        <span className="font-display text-4xl text-white">
          {typeof value === 'number' ? Math.round(value * 10) / 10 : value}
          {unit && <span className="text-xl text-zinc-500 font-sans ml-2">{unit}</span>}
        </span>
      </div>
      <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
        <Icon className={`w-6 h-6 ${accentColor}`} strokeWidth={1.5} />
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex flex-col pt-20">
      <WeatherNav 
        simulateFail={simulateFail} 
        setSimulateFail={setSimulateFail}
        onLocationSelect={(newLat, newLon, name) => {
          setLat(newLat);
          setLon(newLon);
          setLocationName(name);
        }}
      />

      <main className="flex-1 relative flex flex-col items-center justify-center p-6 pb-24 overflow-hidden">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <WeatherSkeleton key="skeleton" />
          ) : error ? (
            <WeatherError key="error" message={error.message} onRetry={() => refetch()} />
          ) : data ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-6xl mx-auto flex flex-col items-center"
            >
              {/* Location Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="px-6 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-16 flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)] animate-pulse" />
                <span className="font-sans text-xs tracking-[0.25em] uppercase text-zinc-300">
                  {data.location}
                </span>
              </motion.div>

              {/* Main Temperature Display */}
              <div className="relative flex flex-col items-center text-center mb-24">
                <motion.div
                  initial={{ opacity: 0, filter: "blur(20px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ delay: 0.3, duration: 1.2 }}
                  className="relative"
                >
                  <h1 className="text-[10rem] md:text-[14rem] font-display leading-none text-gradient tracking-tighter mix-blend-plus-lighter">
                    {Math.round(data.temperature)}&deg;
                  </h1>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 1 }}
                  className="flex items-center gap-4 mt-4"
                >
                  {renderWeatherIcon(data.condition, data.isDay)}
                  <h2 className="text-2xl md:text-3xl font-sans font-light text-zinc-300 tracking-wide">
                    {data.condition}
                  </h2>
                </motion.div>

                {/* Feels Like Temperature */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="mt-4 text-zinc-400 font-sans text-sm"
                >
                  Feels like {Math.round(data.feelsLike)}&deg;C
                </motion.div>
              </div>

              {/* Details Grid - 2 columns on mobile, 4 on larger screens */}
              <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <DetailCard 
                  icon={Droplets}
                  label="Humidity"
                  value={data.humidity}
                  unit="%"
                  delay={0.7}
                  accentColor="text-blue-200"
                />

                <DetailCard 
                  icon={Wind}
                  label="Wind Speed"
                  value={data.windSpeed}
                  unit="km/h"
                  delay={0.8}
                  accentColor="text-zinc-300"
                />

                <DetailCard 
                  icon={Eye}
                  label="Visibility"
                  value={data.visibility}
                  unit="km"
                  delay={0.9}
                  accentColor="text-cyan-200"
                />

                <DetailCard 
                  icon={Gauge}
                  label="Pressure"
                  value={data.pressure}
                  unit="hPa"
                  delay={1.0}
                  accentColor="text-amber-200"
                />
              </div>

              {/* Secondary Details Grid */}
              <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <DetailCard 
                  icon={Cloud}
                  label="Cloud Cover"
                  value={data.cloudCover}
                  unit="%"
                  delay={1.1}
                  accentColor="text-gray-300"
                />

                <DetailCard 
                  icon={CloudRain}
                  label="Precipitation"
                  value={data.precipitation}
                  unit="mm"
                  delay={1.2}
                  accentColor="text-blue-300"
                />

                <DetailCard 
                  icon={Thermometer}
                  label="Dew Point"
                  value={data.dewPoint}
                  unit="°C"
                  delay={1.3}
                  accentColor="text-teal-200"
                />

                <DetailCard 
                  icon={Zap}
                  label="UV Index"
                  value={data.uvIndex}
                  unit=""
                  delay={1.4}
                  accentColor="text-yellow-200"
                />
              </div>

            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
