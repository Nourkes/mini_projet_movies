import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../models/movie.model';
import { MOVIES } from '../data/movies.mock';

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    private moviesKey = 'movieExplorer_movies';
    private favoritesKey = 'movieExplorer_favorites';

    private moviesSubject: BehaviorSubject<Movie[]>;
    private favoritesSubject: BehaviorSubject<number[]>;

    constructor() {
        // Load movies from localStorage or use mock data
        const storedMovies = this.getMoviesFromStorage();
        this.moviesSubject = new BehaviorSubject<Movie[]>(storedMovies.length > 0 ? storedMovies : MOVIES);

        // Load favorites
        this.favoritesSubject = new BehaviorSubject<number[]>(this.getFavoritesFromStorage());

        // If no movies in storage, save the initial mock data
        if (storedMovies.length === 0) {
            this.syncMoviesToStorage();
        }
    }

    // Read Operations
    getMovies(): Observable<Movie[]> {
        return this.moviesSubject.asObservable();
    }

    getMovieById(id: number): Observable<Movie | undefined> {
        return this.moviesSubject.pipe(
            map(movies => movies.find(m => m.id === id))
        );
    }

    // Create Operation
    addMovie(movie: Omit<Movie, 'id'>): void {
        const currentMovies = this.moviesSubject.value;
        const newId = this.getNextId();
        const newMovie: Movie = { ...movie, id: newId };

        const updatedMovies = [...currentMovies, newMovie];
        this.moviesSubject.next(updatedMovies);
        this.syncMoviesToStorage();
    }

    // Update Operation
    updateMovie(id: number, updatedMovie: Omit<Movie, 'id'>): void {
        const currentMovies = this.moviesSubject.value;
        const index = currentMovies.findIndex(m => m.id === id);

        if (index !== -1) {
            const movies = [...currentMovies];
            movies[index] = { ...updatedMovie, id };
            this.moviesSubject.next(movies);
            this.syncMoviesToStorage();
        }
    }

    // Delete Operation
    deleteMovie(id: number): void {
        const currentMovies = this.moviesSubject.value;
        const filteredMovies = currentMovies.filter(m => m.id !== id);

        this.moviesSubject.next(filteredMovies);
        this.syncMoviesToStorage();

        // Also remove from favorites if present
        if (this.isFavorite(id)) {
            this.toggleFavorite(id);
        }
    }

    // Favorites Management
    getFavorites(): Observable<number[]> {
        return this.favoritesSubject.asObservable();
    }

    isFavorite(id: number): boolean {
        return this.favoritesSubject.value.includes(id);
    }

    toggleFavorite(id: number): void {
        const currentFavorites = this.favoritesSubject.value;
        let newFavorites: number[];

        if (currentFavorites.includes(id)) {
            newFavorites = currentFavorites.filter(favId => favId !== id);
        } else {
            newFavorites = [...currentFavorites, id];
        }

        this.updateFavorites(newFavorites);
    }

    // Helper Methods
    private getNextId(): number {
        const currentMovies = this.moviesSubject.value;
        if (currentMovies.length === 0) return 1;
        return Math.max(...currentMovies.map(m => m.id)) + 1;
    }

    private getMoviesFromStorage(): Movie[] {
        const stored = localStorage.getItem(this.moviesKey);
        return stored ? JSON.parse(stored) : [];
    }

    private syncMoviesToStorage(): void {
        localStorage.setItem(this.moviesKey, JSON.stringify(this.moviesSubject.value));
    }

    private getFavoritesFromStorage(): number[] {
        const stored = localStorage.getItem(this.favoritesKey);
        return stored ? JSON.parse(stored) : [];
    }

    private updateFavorites(favorites: number[]): void {
        localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
        this.favoritesSubject.next(favorites);
    }

    // Statistics for Dashboard
    getStats(): Observable<{
        totalMovies: number;
        totalFavorites: number;
        moviesByGenre: { [genre: string]: number };
        averageRating: number;
    }> {
        return this.moviesSubject.pipe(
            map(movies => {
                const genreCount: { [genre: string]: number } = {};
                let totalRating = 0;

                movies.forEach(movie => {
                    movie.genre.forEach(g => {
                        genreCount[g] = (genreCount[g] || 0) + 1;
                    });
                    totalRating += movie.rating;
                });

                return {
                    totalMovies: movies.length,
                    totalFavorites: this.favoritesSubject.value.length,
                    moviesByGenre: genreCount,
                    averageRating: movies.length > 0 ? totalRating / movies.length : 0
                };
            })
        );
    }
}
