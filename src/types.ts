export interface Game {
  id: string;
  title: string;
  description: string;
  releaseDate: string;
  developer: string;
  publisher: string;
  genres: string[];
  platforms: string[];
  rating?: string;
  coverUrl?: string;
  isSubGame?: boolean;
  parentGame?: string;
  subGames?: string[]; // Titles of sub-games if it's a platform like Roblox
}

export interface SearchFilters {
  upcomingOnly: boolean;
  deepSearch: boolean;
}
