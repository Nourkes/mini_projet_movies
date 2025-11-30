import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { FilterMoviesPipe } from '../../pipes/filter-movies.pipe';

@Component({
    selector: 'app-movie-list',
    standalone: true,
    imports: [CommonModule, FormsModule, MovieCardComponent, FilterMoviesPipe],
    templateUrl: './movie-list.component.html',
    styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
    movies: Movie[] = [];
    filteredMovies: Movie[] = [];

    searchQuery: string = '';
    selectedGenre: string = '';
    sortOption: string = 'rating_desc';

    genres: string[] = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Animation', 'Crime', 'Adventure'];

    constructor(
        private movieService: MovieService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.movieService.getMovies().subscribe(data => {
            this.movies = data;
            this.applyFilters();
        });

        this.route.queryParams.subscribe(params => {
            this.searchQuery = params['search'] || '';
            this.applyFilters();
        });
    }

    applyFilters() {
        let result = [...this.movies];

        // Search
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            result = result.filter(m =>
                m.title.toLowerCase().includes(query) ||
                m.genre.some(g => g.toLowerCase().includes(query))
            );
        }

        // Genre Filter
        if (this.selectedGenre) {
            result = result.filter(m => m.genre.includes(this.selectedGenre));
        }

        // Sort
        if (this.sortOption === 'year_desc') {
            result.sort((a, b) => b.year - a.year);
        } else if (this.sortOption === 'year_asc') {
            result.sort((a, b) => a.year - b.year);
        } else if (this.sortOption === 'rating_desc') {
            result.sort((a, b) => b.rating - a.rating);
        } else if (this.sortOption === 'rating_asc') {
            result.sort((a, b) => a.rating - b.rating);
        }

        this.filteredMovies = result;
    }

    onFilterChange() {
        this.applyFilters();
    }
}
