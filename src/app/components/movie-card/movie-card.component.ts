import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { RatingStarsPipe } from '../../pipes/rating-stars.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';
import { TooltipDirective } from '../../directives/tooltip.directive';

@Component({
    selector: 'app-movie-card',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        ConfirmDialogComponent,
        RatingStarsPipe,
        HighlightDirective,
        TooltipDirective
    ],
    templateUrl: './movie-card.component.html',
    styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
    @Input() movie!: Movie;
    @Input() showActions: boolean = true;

    isFavorite: boolean = false;
    showDeleteDialog: boolean = false;

    constructor(
        private movieService: MovieService,
        private router: Router
    ) { }

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
        this.movieService.toggleFavorite(this.movie.id).subscribe({
            error: (err) => console.error('Error toggling favorite:', err)
        });
    }

    onEdit(event: Event) {
        event.stopPropagation();
        event.preventDefault();
        this.router.navigate(['/movies', this.movie.id, 'edit']);
    }

    onDelete(event: Event) {
        event.stopPropagation();
        event.preventDefault();
        this.showDeleteDialog = true;
    }

    confirmDelete() {
        this.movieService.deleteMovie(this.movie.id).subscribe({
            next: () => {
                this.showDeleteDialog = false;
            },
            error: (err) => {
                console.error('Error deleting movie:', err);
                this.showDeleteDialog = false;
            }
        });
    }

    cancelDelete() {
        this.showDeleteDialog = false;
    }
}
