import { motion, AnimatePresence } from "motion/react";
import { Game } from "../types";
import { X, Calendar, Users, Building2, Layers, Globe, Star, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface GameModalProps {
  game: Game | null;
  onClose: () => void;
  onSubGameClick: (title: string) => void;
}

export default function GameModal({ game, onClose, onSubGameClick }: GameModalProps) {
  if (!game) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl glass-dark shadow-2xl flex flex-col md:flex-row"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left: Image & Quick Info */}
          <div className="w-full md:w-2/5 relative h-64 md:h-auto">
            <img
              src={game.coverUrl || `https://picsum.photos/seed/${encodeURIComponent(game.title)}/800/1200`}
              alt={game.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                {game.title}
              </h2>
              <div className="flex flex-wrap gap-2">
                {game.genres.map(g => (
                  <span key={g} className="px-3 py-1 rounded-lg bg-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wider border border-brand-primary/30">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full md:w-3/5 p-6 md:p-10 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase font-bold tracking-widest">
                  <Calendar className="w-3 h-3" />
                  <span>Date de sortie</span>
                </div>
                <p className="text-white font-medium">{game.releaseDate}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase font-bold tracking-widest">
                  <Building2 className="w-3 h-3" />
                  <span>Développeur</span>
                </div>
                <p className="text-white font-medium">{game.developer}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase font-bold tracking-widest">
                  <Globe className="w-3 h-3" />
                  <span>Plateformes</span>
                </div>
                <p className="text-white font-medium">{game.platforms.join(", ")}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 text-xs uppercase font-bold tracking-widest">
                  <Star className="w-3 h-3" />
                  <span>Note</span>
                </div>
                <p className="text-white font-medium">{game.rating || "N/A"}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-secondary" />
                Description
              </h3>
              <div className="prose prose-invert prose-sm max-w-none text-zinc-300 leading-relaxed">
                <ReactMarkdown>{game.description}</ReactMarkdown>
              </div>
            </div>

            {game.subGames && game.subGames.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-accent" />
                  Jeux populaires dans {game.title}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {game.subGames.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => onSubGameClick(sub)}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group text-left"
                    >
                      <span className="font-medium text-zinc-200 group-hover:text-white">{sub}</span>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-brand-primary" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
