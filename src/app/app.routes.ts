import { Routes } from '@angular/router';
import { MovieListComponent } from './pages/movie-list/movie-list.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';

export const routes: Routes = [
    { path: '', redirectTo: '/movies', pathMatch: 'full' },
    { path: 'movies', component: MovieListComponent },
    { path: 'movies/:id', component: MovieDetailComponent },
    { path: 'favorites', component: FavoritesComponent },
    { path: '**', redirectTo: '/movies' }
];
