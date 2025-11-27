import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    totalMovies = 0;
    totalFavorites = 0;
    moviesByGenre: { [genre: string]: number } = {};
    averageRating = 0;

    constructor(private movieService: MovieService) { }

    ngOnInit() {
        this.movieService.getStats().subscribe(stats => {
            this.totalMovies = stats.totalMovies;
            this.totalFavorites = stats.totalFavorites;
            this.moviesByGenre = stats.moviesByGenre;
            this.averageRating = stats.averageRating;
        });
    }

    getGenreEntries(): [string, number][] {
        return Object.entries(this.moviesByGenre).sort((a, b) => b[1] - a[1]);
    }
}
