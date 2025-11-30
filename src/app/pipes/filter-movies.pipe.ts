import { Pipe, PipeTransform } from '@angular/core';
import { Movie } from '../models/movie.model';

@Pipe({
    name: 'filterMovies',
    standalone: true
})
export class FilterMoviesPipe implements PipeTransform {
    /**
     * Filtre les films selon plusieurs critères
     * @param movies - Liste des films à filtrer
     * @param searchTerm - Terme de recherche (titre, genre, acteurs)
     * @param filterType - Type de filtre: 'all', 'title', 'genre', 'cast'
     * @returns Liste des films filtrés
     */
    transform(movies: Movie[], searchTerm: string, filterType: string = 'all'): Movie[] {
        if (!movies || !searchTerm || searchTerm.trim() === '') {
            return movies;
        }

        const term = searchTerm.toLowerCase().trim();

        return movies.filter(movie => {
            switch (filterType) {
                case 'title':
                    return movie.title.toLowerCase().includes(term);

                case 'genre':
                    return movie.genre.some(g => g.toLowerCase().includes(term));

                case 'cast':
                    return movie.cast.some(actor => actor.toLowerCase().includes(term));

                case 'all':
                default:
                    return (
                        movie.title.toLowerCase().includes(term) ||
                        movie.genre.some(g => g.toLowerCase().includes(term)) ||
                        movie.cast.some(actor => actor.toLowerCase().includes(term)) ||
                        movie.synopsis.toLowerCase().includes(term)
                    );
            }
        });
    }
}
