import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { RatingValidatorDirective } from '../../directives/rating-validator.directive';

@Component({
    selector: 'app-movie-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RatingValidatorDirective],
    templateUrl: './movie-form.component.html',
    styleUrls: ['./movie-form.component.css']
})
export class MovieFormComponent implements OnInit {
    movieForm: FormGroup;
    isEditMode = false;
    movieId: string | number | null = null; // Support both string and number

    currentYear = new Date().getFullYear();

    genreOptions = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Animation', 'Crime', 'Adventure', 'Fantasy', 'Thriller'];

    constructor(
        private fb: FormBuilder,
        private movieService: MovieService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.movieForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(1)]],
            year: ['', [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]],
            genre: this.fb.array([], Validators.required),
            rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
            poster: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
            synopsis: ['', Validators.required],
            cast: ['', Validators.required],
            type: ['movie', Validators.required],
            duration: ['', Validators.required]
        });
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.movieId = id; // Keep as string or number
            this.loadMovie(this.movieId);
        }
    }

    get genreArray(): FormArray {
        return this.movieForm.get('genre') as FormArray;
    }

    onGenreChange(event: any) {
        const genre = event.target.value;
        if (event.target.checked) {
            this.genreArray.push(this.fb.control(genre));
        } else {
            const index = this.genreArray.controls.findIndex(x => x.value === genre);
            this.genreArray.removeAt(index);
        }
    }

    isGenreSelected(genre: string): boolean {
        return this.genreArray.value.includes(genre);
    }


    loadMovie(id: string | number) {
        this.movieService.getMovieById(id).subscribe({
            next: (movie) => {
                if (movie) {
                    // Vider d'abord le FormArray des genres
                    while (this.genreArray.length) {
                        this.genreArray.removeAt(0);
                    }

                    // Remplir le formulaire avec les données du film
                    this.movieForm.patchValue({
                        title: movie.title,
                        year: movie.year,
                        rating: movie.rating,
                        poster: movie.poster,
                        synopsis: movie.synopsis,
                        cast: movie.cast.join(', '),
                        type: movie.type,
                        duration: movie.duration
                    });

                    // Ajouter les genres au FormArray
                    movie.genre.forEach(g => {
                        this.genreArray.push(this.fb.control(g));
                    });
                }
            },
            error: (err) => {
                console.error('Erreur lors du chargement du film:', err);
                alert('Erreur lors du chargement du film. Veuillez réessayer.');
            }
        });
    }

    onSubmit() {
        if (this.movieForm.valid) {
            const formValue = this.movieForm.value;
            const movieData = {
                ...formValue,
                cast: formValue.cast.split(',').map((c: string) => c.trim()),
                genre: this.genreArray.value
            };

            if (this.isEditMode && this.movieId) {
                this.movieService.updateMovie(this.movieId, movieData).subscribe({
                    next: () => {
                        this.router.navigate(['/movies']);
                    },
                    error: (err) => console.error('Error updating movie:', err)
                });
            } else {
                this.movieService.addMovie(movieData).subscribe({
                    next: () => {
                        this.router.navigate(['/movies']);
                    },
                    error: (err) => console.error('Error adding movie:', err)
                });
            }
        }
    }

    onCancel() {
        this.router.navigate(['/movies']);
    }
}
