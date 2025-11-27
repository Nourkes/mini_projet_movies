import { Routes } from '@angular/router';
import { MovieListComponent } from './pages/movie-list/movie-list.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { MovieFormComponent } from './components/movie-form/movie-form.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: '/movies', pathMatch: 'full' },
    { path: 'movies', component: MovieListComponent },
    { path: 'movies/new', component: MovieFormComponent },
    { path: 'movies/:id', component: MovieDetailComponent },
    { path: 'movies/:id/edit', component: MovieFormComponent },
    { path: 'favorites', component: FavoritesComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: '**', redirectTo: '/movies' }
];
