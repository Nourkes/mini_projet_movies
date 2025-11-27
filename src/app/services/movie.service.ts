import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Movie } from '../models/movie.model';
import { MOVIES } from '../data/movies.mock';

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    private movies: Movie[] = MOVIES;
    private favoritesKey = 'movieExplorer_favorites';
    private favoritesSubject = new BehaviorSubject<number[]>(this.getFavoritesFromStorage());

    constructor() { }

    getMovies(): Observable<Movie[]> {
        return of(this.movies);
    }

    getMovieById(id: number): Observable<Movie | undefined> {
        const movie = this.movies.find(m => m.id === id);
        return of(movie);
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

    private getFavoritesFromStorage(): number[] {
        const stored = localStorage.getItem(this.favoritesKey);
        return stored ? JSON.parse(stored) : [];
    }

    private updateFavorites(favorites: number[]): void {
        localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
        this.favoritesSubject.next(favorites);
    }
}
