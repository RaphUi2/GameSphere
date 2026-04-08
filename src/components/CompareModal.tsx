import { motion, AnimatePresence } from "motion/react";
import { Game } from "../types";
import { X, GitCompare, Star, Calendar, Monitor } from "lucide-react";

interface CompareModalProps {
  games: Game[];
  onClose: () => void;
  onRemove: (game: Game) => void;
}

export default function CompareModal({ games, onClose, onRemove }: CompareModalProps) {
  if (games.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl glass-dark border border-white/10 shadow-2xl flex flex-col"
        >
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <GitCompare className="w-6 h-6 text-brand-primary" />
              Comparaison de Jeux
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-zinc-400">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-grow overflow-x-auto p-6">
            <div className="grid grid-cols-3 gap-6 min-w-[900px]">
              {games.map((game) => (
                <div key={game.id} className="space-y-6 relative group">
                  <button
                    onClick={() => onRemove(game)}
                    className="absolute -top-2 -right-2 z-10 p-1.5 rounded-full bg-red-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="aspect-video rounded-xl overflow-hidden border border-white/10">
                    <img
                      src={game.coverUrl || `https://picsum.photos/seed/${encodeURIComponent(game.title)}/600/400`}
                      alt={game.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">{game.title}</h3>
                    
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Note</p>
                        <div className="flex items-center gap-1 text-brand-accent">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="font-bold">{game.rating || "N/A"}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Sortie</p>
                        <div className="flex items-center gap-2 text-zinc-200">
                          <Calendar className="w-4 h-4" />
                          <span>{game.releaseDate}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Plateformes</p>
                        <div className="flex items-center gap-2 text-zinc-200">
                          <Monitor className="w-4 h-4" />
                          <span className="text-sm line-clamp-2">{game.platforms.join(", ")}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Genres</p>
                        <div className="flex flex-wrap gap-1">
                          {game.genres.map(g => (
                            <span key={g} className="text-[10px] px-2 py-0.5 rounded bg-brand-primary/20 text-brand-primary border border-brand-primary/20">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                        <p className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">Description</p>
                        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-6">{game.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Empty slots */}
              {[...Array(3 - games.length)].map((_, i) => (
                <div key={i} className="rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-600 p-12">
                  <GitCompare className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-sm font-medium">Ajoutez un jeu pour comparer</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
