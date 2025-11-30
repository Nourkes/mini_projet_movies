import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    private apiUrl = 'http://localhost:3000/movies';
    private favoritesUrl = 'http://localhost:3000/favorites';

    private moviesSubject: BehaviorSubject<Movie[]> = new BehaviorSubject<Movie[]>([]);
    private favoritesSubject: BehaviorSubject<(string | number)[]> = new BehaviorSubject<(string | number)[]>([]);

    constructor(private http: HttpClient) {
        // Charger les films et favoris au démarrage
        this.loadMoviesFromServer();
        this.loadFavoritesFromServer();
    }

    /**
     * Charge les films depuis le serveur
     */
    private loadMoviesFromServer(): void {
        this.http.get<Movie[]>(this.apiUrl).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement des films:', error);
                return throwError(() => error);
            })
        ).subscribe(movies => {
            this.moviesSubject.next(movies);
        });
    }

    /**
     * Charge les favoris depuis le serveur
     */
    private loadFavoritesFromServer(): void {
        this.http.get<{ ids: (string | number)[] }>(this.favoritesUrl).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement des favoris:', error);
                // Si l'endpoint n'existe pas encore ou erreur, retourner un tableau vide
                return throwError(() => error);
            })
        ).subscribe({
            next: (data) => {
                this.favoritesSubject.next(data.ids || []);
            },
            error: () => {
                this.favoritesSubject.next([]);
            }
        });
    }

    // ==================== READ Operations ====================

    /**
     * Retourne un Observable de tous les films
     */
    getMovies(): Observable<Movie[]> {
        return this.moviesSubject.asObservable();
    }

    /**
     * Retourne un film par son ID (supporte string et number)
     */
    getMovieById(id: string | number): Observable<Movie | undefined> {
        return this.http.get<Movie>(`${this.apiUrl}/${id}`).pipe(
            catchError(error => {
                console.error(`Erreur lors de la récupération du film ${id}:`, error);
                return throwError(() => error);
            })
        );
    }

    // ==================== CREATE Operation ====================

    /**
     * Ajoute un nouveau film
     */
    addMovie(movie: Omit<Movie, 'id'>): Observable<Movie> {
        return this.http.post<Movie>(this.apiUrl, movie).pipe(
            tap(newMovie => {
                // Mettre à jour le BehaviorSubject local
                const currentMovies = this.moviesSubject.value;
                this.moviesSubject.next([...currentMovies, newMovie]);
            }),
            catchError(error => {
                console.error('Erreur lors de l\'ajout du film:', error);
                return throwError(() => error);
            })
        );
    }

    // ==================== UPDATE Operation ====================

    /**
     * Met à jour un film existant (supporte string et number pour ID)
     */
    updateMovie(id: string | number, updatedMovie: Omit<Movie, 'id'>): Observable<Movie> {
        const movieWithId: Movie = { ...updatedMovie, id };

        return this.http.put<Movie>(`${this.apiUrl}/${id}`, movieWithId).pipe(
            tap(movie => {
                // Mettre à jour le BehaviorSubject local
                const currentMovies = this.moviesSubject.value;
                const index = currentMovies.findIndex(m => m.id == id); // Use == for loose comparison
                if (index !== -1) {
                    const updatedMovies = [...currentMovies];
                    updatedMovies[index] = movie;
                    this.moviesSubject.next(updatedMovies);
                }
            }),
            catchError(error => {
                console.error(`Erreur lors de la mise à jour du film ${id}:`, error);
                return throwError(() => error);
            })
        );
    }

    // ==================== DELETE Operation ====================

    /**
     * Supprime un film (supporte string et number pour ID)
     */
    deleteMovie(id: string | number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                // Mettre à jour le BehaviorSubject local
                const currentMovies = this.moviesSubject.value;
                const filteredMovies = currentMovies.filter(m => m.id != id); // Use != for loose comparison
                this.moviesSubject.next(filteredMovies);

                // Retirer des favoris si présent
                if (this.isFavorite(id)) {
                    this.toggleFavorite(id).subscribe();
                }
            }),
            catchError(error => {
                console.error(`Erreur lors de la suppression du film ${id}:`, error);
                return throwError(() => error);
            })
        );
    }

    // ==================== FAVORITES Management ====================

    /**
     * Retourne un Observable des IDs favoris
     */
    getFavorites(): Observable<(string | number)[]> {
        return this.favoritesSubject.asObservable();
    }

    /**
     * Vérifie si un film est dans les favoris (supporte string et number)
     */
    isFavorite(id: string | number): boolean {
        return this.favoritesSubject.value.some(favId => favId == id); // Use == for loose comparison
    }

    /**
     * Ajoute ou retire un film des favoris (supporte string et number)
     */
    toggleFavorite(id: string | number): Observable<(string | number)[]> {
        const currentFavorites = this.favoritesSubject.value;
        let newFavorites: (string | number)[];

        // Keep the ID as-is (string or number)
        const existingIndex = currentFavorites.findIndex(favId => favId == id);

        if (existingIndex !== -1) {
            // Remove from favorites
            newFavorites = currentFavorites.filter(favId => favId != id);
        } else {
            // Add to favorites
            newFavorites = [...currentFavorites, id];
        }

        // Mettre à jour sur le serveur (PUT avec structure object)
        return this.http.put<{ ids: (string | number)[] }>(this.favoritesUrl, { ids: newFavorites }).pipe(
            map(response => response.ids),
            tap(favorites => {
                this.favoritesSubject.next(favorites);
            }),
            catchError(error => {
                console.error('Erreur lors de la mise à jour des favoris:', error);
                return throwError(() => error);
            })
        );
    }

    // ==================== STATISTICS ====================

    /**
     * Retourne des statistiques pour le dashboard
     */
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
