export interface Movie {
    id: number | string;
    title: string;
    year: number;
    genre: string[];
    rating: number;
    poster: string;
    synopsis: string;
    cast: string[];
    type: 'movie' | 'series';
    duration?: string; // e.g., "2h 15m" or "3 Seasons"
}
