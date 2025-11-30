import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of, forkJoin } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { Movie } from '../models/movie.model';

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    private apiUrl = 'http://localhost:3000/movies';
    private favoritesUrl = 'http://localhost:3000/favorites';

    private moviesSubject: BehaviorSubject<Movie[]> = new BehaviorSubject<Movie[]>([]);
    private favoritesSubject: BehaviorSubject<(number | string)[]> = new BehaviorSubject<(number | string)[]>([]);

    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private http: HttpClient) {
        this.loadMovies();
        this.loadFavorites();
    }

    private loadMovies() {
        this.http.get<Movie[]>(this.apiUrl).pipe(
            tap(movies => this.moviesSubject.next(movies)),
            catchError(this.handleError<Movie[]>('getMovies', []))
        ).subscribe();
    }

    private loadFavorites() {
        // json-server returns array of objects. We assume we store { id: movieId, movieId: movieId } 
        // or just { id: movieId } if we want to keep it simple.
        // Let's assume we store { id: "movie_123", movieId: 123 } to avoid ID collisions if we used auto-increment.
        // Or simpler: { id: 123 } where id is the movie ID.
        this.http.get<any[]>(this.favoritesUrl).pipe(
            map(favs => favs.map(f => f.id)), // Extract IDs
            tap(favorites => this.favoritesSubject.next(favorites)),
            catchError(this.handleError<(number | string)[]>('getFavorites', []))
        ).subscribe();
    }

    // ==================== READ Operations ====================

    getMovies(): Observable<Movie[]> {
        return this.moviesSubject.asObservable();
    }

    getMovieById(id: number | string): Observable<Movie | undefined> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<Movie>(url).pipe(
            catchError(this.handleError<Movie>(`getMovie id=${id}`))
        );
    }

    // ==================== CREATE Operation ====================

    addMovie(movie: Omit<Movie, 'id'>): Observable<Movie> {
        return this.http.post<Movie>(this.apiUrl, movie, this.httpOptions).pipe(
            tap((newMovie: Movie) => {
                const currentMovies = this.moviesSubject.value;
                this.moviesSubject.next([...currentMovies, newMovie]);
            }),
            catchError(this.handleError<Movie>('addMovie'))
        );
    }

    // ==================== UPDATE Operation ====================

    updateMovie(id: number | string, updatedMovie: Omit<Movie, 'id'>): Observable<any> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put(url, updatedMovie, this.httpOptions).pipe(
            tap(movie => {
                const currentMovies = this.moviesSubject.value;
                const index = currentMovies.findIndex(m => m.id === id);
                if (index !== -1) {
                    const movies = [...currentMovies];
                    movies[index] = { ...updatedMovie, id } as Movie;
                    this.moviesSubject.next(movies);
                }
            }),
            catchError(this.handleError<any>('updateMovie'))
        );
    }

    // ==================== DELETE Operation ====================

    deleteMovie(id: number | string): Observable<Movie> {
        const url = `${this.apiUrl}/${id}`;

        return this.http.delete<Movie>(url, this.httpOptions).pipe(
            tap(_ => {
                const currentMovies = this.moviesSubject.value;
                this.moviesSubject.next(currentMovies.filter(m => m.id !== id));

                // Also remove from favorites if present
                if (this.isFavorite(id)) {
                    this.removeFromFavorites(id).subscribe();
                }
            }),
            catchError(this.handleError<Movie>('deleteMovie'))
        );
    }

    // ==================== FAVORITES Management ====================

    getFavorites(): Observable<(number | string)[]> {
        return this.favoritesSubject.asObservable();
    }

    isFavorite(id: number | string): boolean {
        return this.favoritesSubject.value.includes(id);
    }

    toggleFavorite(id: number | string): Observable<any> {
        if (this.isFavorite(id)) {
            return this.removeFromFavorites(id);
        } else {
            return this.addToFavorites(id);
        }
    }

    private addToFavorites(id: number | string): Observable<any> {
        // We use the movie ID as the ID in the favorites collection
        const favorite = { id: id };
        return this.http.post(this.favoritesUrl, favorite, this.httpOptions).pipe(
            tap(() => {
                const currentFavorites = this.favoritesSubject.value;
                this.favoritesSubject.next([...currentFavorites, id]);
            }),
            catchError(this.handleError<any>('addToFavorites'))
        );
    }

    private removeFromFavorites(id: number | string): Observable<any> {
        const url = `${this.favoritesUrl}/${id}`;
        return this.http.delete(url, this.httpOptions).pipe(
            tap(() => {
                const currentFavorites = this.favoritesSubject.value;
                this.favoritesSubject.next(currentFavorites.filter(favId => favId !== id));
            }),
            catchError(this.handleError<any>('removeFromFavorites'))
        );
    }

    // ==================== STATISTICS ====================

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

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(`${operation} failed: ${error.message}`);
            return of(result as T);
        };
    }
}
