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
    private favoritesSubject: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

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
        this.http.get<number[]>(this.favoritesUrl).pipe(
            catchError(error => {
                console.error('Erreur lors du chargement des favoris:', error);
                // Si l'endpoint n'existe pas encore, retourner un tableau vide
                return throwError(() => error);
            })
        ).subscribe(favorites => {
            this.favoritesSubject.next(favorites || []);
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
     * Retourne un film par son ID
     */
    getMovieById(id: number): Observable<Movie | undefined> {
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
     * Met à jour un film existant
     */
    updateMovie(id: number, updatedMovie: Omit<Movie, 'id'>): Observable<Movie> {
        const movieWithId: Movie = { ...updatedMovie, id };

        return this.http.put<Movie>(`${this.apiUrl}/${id}`, movieWithId).pipe(
            tap(movie => {
                // Mettre à jour le BehaviorSubject local
                const currentMovies = this.moviesSubject.value;
                const index = currentMovies.findIndex(m => m.id === id);
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
     * Supprime un film
     */
    deleteMovie(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
            tap(() => {
                // Mettre à jour le BehaviorSubject local
                const currentMovies = this.moviesSubject.value;
                const filteredMovies = currentMovies.filter(m => m.id !== id);
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
    getFavorites(): Observable<number[]> {
        return this.favoritesSubject.asObservable();
    }

    /**
     * Vérifie si un film est dans les favoris
     */
    isFavorite(id: number): boolean {
        return this.favoritesSubject.value.includes(id);
    }

    /**
     * Ajoute ou retire un film des favoris
     */
    toggleFavorite(id: number): Observable<number[]> {
        const currentFavorites = this.favoritesSubject.value;
        let newFavorites: number[];

        if (currentFavorites.includes(id)) {
            newFavorites = currentFavorites.filter(favId => favId !== id);
        } else {
            newFavorites = [...currentFavorites, id];
        }

        // Mettre à jour sur le serveur (PUT pour remplacer toute la liste)
        return this.http.put<number[]>(this.favoritesUrl, newFavorites).pipe(
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
