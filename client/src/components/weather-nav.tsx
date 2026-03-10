import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuxurySwitch } from "./ui/luxury-switch";
import { useLocationSearch } from "@/hooks/use-weather";
import { MapPin, Search, Loader2 } from "lucide-react";

interface WeatherNavProps {
  simulateFail: boolean;
  setSimulateFail: (val: boolean) => void;
  onLocationSelect: (lat: number, lon: number, name: string) => void;
}

export function WeatherNav({ simulateFail, setSimulateFail, onLocationSelect }: WeatherNavProps) {
  const [searchInput, setSearchInput] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: searchResults = [] } = useLocationSearch(debouncedSearch);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Debounce search input
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 400);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchInput]);

  const handleLocationClick = (lat: number, lon: number, name: string) => {
    setSearchInput("");
    setDebouncedSearch("");
    setShowSearchDropdown(false);
    onLocationSelect(lat, lon, name);
  };

  const handleGeolocation = async () => {
    setIsLoadingGeo(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          // Reverse geocode to get location name
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await res.json();
            const locationName = data.address?.city || data.address?.town || data.name || "Current Location";
            onLocationSelect(latitude, longitude, locationName);
          } catch {
            onLocationSelect(latitude, longitude, "Current Location");
          }
          setIsLoadingGeo(false);
        },
        () => {
          setIsLoadingGeo(false);
        }
      );
    }
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-white/80 to-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <div className="w-3 h-3 rounded-full bg-black"></div>
          </div>
          <span className="font-display text-xl tracking-widest text-white">Weather</span>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Location Search */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-zinc-500 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search location..."
                value={searchInput}
onChange={(e) => {
  setSearchInput(e.target.value);
  setShowSearchDropdown(!!e.target.value);
}}
onFocus={() => searchInput && setShowSearchDropdown(true)}
                className="pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all text-sm w-48"
              />
            </div>

<AnimatePresence>
  {showSearchDropdown && searchInput && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-lg overflow-hidden shadow-2xl max-h-64 overflow-y-auto"
                >
                  {searchResults.map((result, idx) => {
                    const displayName = result.admin1 
                      ? `${result.name}, ${result.admin1}` 
                      : result.name;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleLocationClick(result.lat, result.lon, displayName)}
                        className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <span className="text-white block truncate">{result.name}</span>
                            {result.admin1 && <span className="text-zinc-500 text-xs block">{result.admin1}</span>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Geolocation Button */}
          <button
            onClick={handleGeolocation}
            disabled={isLoadingGeo}
            className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50"
            title="Use my location"
          >
            {isLoadingGeo ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <MapPin className="w-4 h-4 text-white" />
            )}
          </button>

          {/* Simulate Failure Toggle */}
          <LuxurySwitch 
            checked={simulateFail} 
            onCheckedChange={setSimulateFail} 
            label="Simulate Disruption"
          />
        </div>
      </div>
    </motion.nav>
  );
}
