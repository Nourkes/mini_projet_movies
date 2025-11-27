import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';

@Component({
    selector: 'app-movie-card',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './movie-card.component.html',
    styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
    @Input() movie!: Movie;
    isFavorite: boolean = false;

    constructor(private movieService: MovieService) { }

    ngOnInit() {
        this.checkFavorite();
        // Subscribe to changes to update UI in real-time if needed
        this.movieService.getFavorites().subscribe(() => {
            this.checkFavorite();
        });
    }

    checkFavorite() {
        if (this.movie) {
            this.isFavorite = this.movieService.isFavorite(this.movie.id);
        }
    }

    toggleFavorite(event: Event) {
        event.stopPropagation(); // Prevent navigation when clicking heart
        event.preventDefault();
        this.movieService.toggleFavorite(this.movie.id);
    }
}
