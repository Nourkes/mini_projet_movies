import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
    selector: 'app-movie-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './movie-detail.component.html',
    styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
    movie: Movie | undefined;
    isFavorite: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private movieService: MovieService
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id'); // Keep as string or number
        if (id) {
            this.movieService.getMovieById(id).subscribe({
                next: (movie) => {
                    this.movie = movie;
                    if (this.movie) {
                        this.checkFavorite();
                    }
                },
                error: (err) => {
                    console.error('Error loading movie:', err);
                    this.movie = undefined;
                }
            });
        }

        this.movieService.getFavorites().subscribe(() => {
            if (this.movie) this.checkFavorite();
        });
    }

    checkFavorite() {
        if (this.movie) {
            this.isFavorite = this.movieService.isFavorite(this.movie.id);
        }
    }

    toggleFavorite() {
        if (this.movie) {
            this.movieService.toggleFavorite(this.movie.id).subscribe({
                error: (err) => console.error('Error toggling favorite:', err)
            });
        }
    }
}
