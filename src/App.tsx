import { useState, useEffect } from "react";
import { Game, SearchFilters } from "./types";
import { searchGames, getGameDetails } from "./services/gemini";
import SearchSection from "./components/SearchSection";
import GameCard from "./components/GameCard";
import GameModal from "./components/GameModal";
import ImageDetection from "./components/ImageDetection";
import CompareModal from "./components/CompareModal";
import { motion, AnimatePresence } from "motion/react";
import { Gamepad2, TrendingUp, Info, AlertCircle, GitCompare, Heart } from "lucide-react";
import { cn } from "./lib/utils";

export default function App() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [compareList, setCompareList] = useState<Game[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load favorites from local storage
  useEffect(() => {
    const saved = localStorage.getItem("gamesphere_favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (game: Game) => {
    setFavorites(prev => {
      const exists = prev.find(g => g.id === game.id);
      const next = exists ? prev.filter(g => g.id !== game.id) : [...prev, game];
      localStorage.setItem("gamesphere_favorites", JSON.stringify(next));
      return next;
    });
  };

  const toggleCompare = (game: Game) => {
    setCompareList(prev => {
      const exists = prev.find(g => g.id === game.id);
      if (exists) return prev.filter(g => g.id !== game.id);
      if (prev.length >= 3) return prev; // Limit to 3
      return [...prev, game];
    });
  };

  const handleSearch = async (query: string, filters: SearchFilters) => {
    setIsLoading(true);
    setError(null);
    setShowFavoritesOnly(false);
    try {
      const results = await searchGames(query, filters);
      setGames(results);
      if (results.length === 0) {
        setError("Aucun jeu trouvé. Essayez une autre recherche.");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la recherche.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const displayedGames = showFavoritesOnly ? favorites : games;

  const handleDetected = (game: Game) => {
    setGames(prev => [game, ...prev.filter(g => g.id !== game.id)]);
    setSelectedGame(game);
  };

  const handleSubGameClick = async (title: string) => {
    setIsLoading(true);
    try {
      const details = await getGameDetails(title);
      if (details) {
        setSelectedGame(details);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-dark border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              GAME<span className="text-brand-primary">SPHERE</span>
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Découvrir</a>
            <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Tendances</a>
            <a href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">À venir</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={cn(
                "p-2 rounded-xl transition-all",
                showFavoritesOnly ? "bg-red-500 text-white" : "hover:bg-white/5 text-zinc-400"
              )}
            >
              <Heart className={cn("w-5 h-5", showFavoritesOnly && "fill-current")} />
            </button>
            {compareList.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary text-white font-bold text-sm hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20"
              >
                <GitCompare className="w-4 h-4" />
                Comparer ({compareList.length})
              </button>
            )}
            <button className="p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20">
        <SearchSection onSearch={handleSearch} isLoading={isLoading} />

        <div className="max-w-7xl mx-auto px-6 pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              {showFavoritesOnly ? (
                <Heart className="w-6 h-6 text-red-500 fill-current" />
              ) : (
                <TrendingUp className="w-6 h-6 text-brand-primary" />
              )}
              {showFavoritesOnly ? "Mes Favoris" : "Résultats & Tendances"}
            </h2>
            <div className="text-sm text-zinc-500">
              {displayedGames.length} jeux trouvés
            </div>
          </div>

          {error && !showFavoritesOnly && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <AlertCircle className="w-16 h-16 text-zinc-700 mb-4" />
              <p className="text-xl text-zinc-500 max-w-md">{error}</p>
            </motion.div>
          )}

          {showFavoritesOnly && favorites.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Heart className="w-16 h-16 text-zinc-800 mb-4" />
              <p className="text-xl text-zinc-500">Vous n'avez pas encore de favoris.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {displayedGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onClick={setSelectedGame}
                  onCompareToggle={toggleCompare}
                  isComparing={!!compareList.find(g => g.id === game.id)}
                  onFavoriteToggle={toggleFavorite}
                  isFavorite={!!favorites.find(g => g.id === game.id)}
                />
              ))}
            </AnimatePresence>
          </div>

          {isLoading && games.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 glass-dark">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-50">
            <Gamepad2 className="w-5 h-5" />
            <span className="text-lg font-bold tracking-tighter">GAMESPHERE</span>
          </div>
          <p className="text-zinc-500 text-sm">
            © 2026 GameSphere. Propulsé par l'IA pour les passionnés de jeux vidéo.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">Twitter</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">Discord</a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">GitHub</a>
          </div>
        </div>
      </footer>

      <GameModal
        game={selectedGame}
        onClose={() => setSelectedGame(null)}
        onSubGameClick={handleSubGameClick}
      />

      {isCompareOpen && (
        <CompareModal
          games={compareList}
          onClose={() => setIsCompareOpen(false)}
          onRemove={toggleCompare}
        />
      )}

      <ImageDetection onDetected={handleDetected} />
    </div>
  );
}
