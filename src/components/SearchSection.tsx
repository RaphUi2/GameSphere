import { useState } from "react";
import { Search, Sparkles, Filter, Zap } from "lucide-react";
import { SearchFilters } from "../types";
import { cn } from "../lib/utils";
import { motion } from "motion/react";

interface SearchSectionProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  isLoading: boolean;
}

export default function SearchSection({ onSearch, isLoading }: SearchSectionProps) {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    upcomingOnly: false,
    deepSearch: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, filters);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Explorez l'univers du <span className="text-gradient">Gaming</span>
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
          Découvrez tous les jeux au monde, les sorties à venir et les secrets cachés dans vos plateformes préférées.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center">
          <div className="absolute left-6 text-zinc-500 group-focus-within:text-brand-primary transition-colors">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un jeu, une plateforme (Roblox, Fortnite...)"
            className="w-full h-16 md:h-20 pl-16 pr-32 rounded-2xl glass text-xl md:text-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all placeholder:text-zinc-600"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-3 h-10 md:h-14 px-6 md:px-8 rounded-xl bg-brand-primary text-white font-bold hover:bg-brand-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span className="hidden md:inline">Rechercher</span>
              </>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={() => setFilters(f => ({ ...f, upcomingOnly: !f.upcomingOnly }))}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium",
              filters.upcomingOnly 
                ? "bg-brand-primary/20 border-brand-primary text-brand-primary" 
                : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
            )}
          >
            <Sparkles className="w-4 h-4" />
            Jeux à venir
          </button>
          
          <button
            type="button"
            onClick={() => setFilters(f => ({ ...f, deepSearch: !f.deepSearch }))}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium",
              filters.deepSearch 
                ? "bg-brand-accent/20 border-brand-accent text-brand-accent" 
                : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
            )}
          >
            <Filter className="w-4 h-4" />
            Recherche approfondie
          </button>
        </div>
      </form>
    </div>
  );
}
