import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

@Component({
    selector: 'app-favorites',
    standalone: true,
    imports: [CommonModule, MovieCardComponent],
    templateUrl: './favorites.component.html',
    styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
    favoriteMovies: Movie[] = [];

    constructor(private movieService: MovieService) { }

    ngOnInit() {
        this.movieService.getFavorites().subscribe(favIds => {
            this.movieService.getMovies().subscribe(allMovies => {
                this.favoriteMovies = allMovies.filter(m => favIds.includes(m.id));
            });
        });
    }
}
