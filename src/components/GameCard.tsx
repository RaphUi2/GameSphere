import { motion } from "motion/react";
import { Game } from "../types";
import { Calendar, Monitor, Tag, GitCompare, Heart } from "lucide-react";
import { cn } from "../lib/utils";

interface GameCardProps {
  game: Game;
  onClick: (game: Game) => void;
  onCompareToggle: (game: Game) => void;
  isComparing: boolean;
  onFavoriteToggle: (game: Game) => void;
  isFavorite: boolean;
}

export default function GameCard({ 
  game, 
  onClick, 
  onCompareToggle, 
  isComparing,
  onFavoriteToggle,
  isFavorite
}: GameCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative cursor-pointer overflow-hidden rounded-2xl glass-dark transition-all hover:border-white/20 hover:shadow-2xl hover:shadow-brand-primary/10"
    >
      {/* Actions Overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCompareToggle(game);
          }}
          className={cn(
            "p-2 rounded-lg transition-all",
            isComparing 
              ? "bg-brand-primary text-white scale-110 shadow-lg" 
              : "bg-black/50 text-white/70 hover:bg-white/10 hover:text-white"
          )}
        >
          <GitCompare className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(game);
          }}
          className={cn(
            "p-2 rounded-lg transition-all",
            isFavorite 
              ? "bg-red-500 text-white scale-110 shadow-lg" 
              : "bg-black/50 text-white/70 hover:bg-white/10 hover:text-white"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
        </button>
      </div>

      {/* Cover Image */}
      <div onClick={() => onClick(game)} className="aspect-[3/4] overflow-hidden">
        <img
          src={game.coverUrl || `https://picsum.photos/seed/${encodeURIComponent(game.title)}/600/800`}
          alt={game.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex flex-wrap gap-2 mb-2">
          {game.isSubGame && (
            <span className="px-2 py-0.5 rounded-full bg-brand-accent/20 text-brand-accent text-[10px] font-bold uppercase tracking-wider border border-brand-accent/30">
              Sub-Game
            </span>
          )}
          {game.genres.slice(0, 2).map((genre) => (
            <span key={genre} className="px-2 py-0.5 rounded-full bg-white/10 text-white/70 text-[10px] font-medium uppercase tracking-wider border border-white/5">
              {genre}
            </span>
          ))}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-brand-primary transition-colors">
          {game.title}
        </h3>
        
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{game.releaseDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Monitor className="w-3 h-3" />
            <span className="line-clamp-1">{game.platforms[0]}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
