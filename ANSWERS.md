# Réponses aux Questions de Cours Angular

## 1. Les Composants Angular

### Qu'est-ce qu'un composant Angular?
Un composant Angular est une classe TypeScript décorée avec `@Component` qui contrôle une portion de l'interface utilisateur. Chaque composant possède:
- **Template** (HTML): Vue de l'interface
- **Classe** (TypeScript): Logique et données
- **Styles** (CSS): Apparence visuelle
- **Métadonnées**: Configuration du composant

### Composants dans notre projet (8 composants):
1. **AppComponent**: Composant racine
2. **NavbarComponent**: Navigation de l'application
3. **MovieCardComponent**: Affichage d'une carte de film
4. **MovieFormComponent**: Formulaire création/édition de films
5. **ConfirmDialogComponent**: Dialogue de confirmation
6. **MovieListComponent**: Page liste des films
7. **MovieDetailComponent**: Page détails d'un film
8. **DashboardComponent**: Tableau de bord avec statistiques
9. **FavoritesComponent**: Page des films favoris

### Composants Imbriqués
- `MovieCardComponent` est imbriqué dans `MovieListComponent` et `FavoritesComponent`
- `ConfirmDialogComponent` est imbriqué dans `MovieCardComponent`
- `NavbarComponent` est imbriqué dans `AppComponent`

## 2. Services Angular et Injection de Dépendances

### Qu'est-ce qu'un service?
Un service est une classe TypeScript décorée avec `@Injectable` qui fournit une logique métier réutilisable et partagée entre composants.

### MovieService dans notre projet:
```typescript
@Injectable({ providedIn: 'root' })
export class MovieService {
  private http: HttpClient;
  // CRUD operations via HTTP
  getMovies(): Observable<Movie[]>
  addMovie(movie): Observable<Movie>
  updateMovie(id, movie): Observable<Movie>
  deleteMovie(id): Observable<void>
}
```

### Avantages:
- **Réutilisabilité**: Un seul service partagé par tous les composants
- **Séparation des responsabilités**: Logique métier séparée de l'UI
- **Testabilité**: Plus facile à tester unitairement
- **État centralisé**: BehaviorSubject pour partager les données

## 3. Routing Angular

### Configuration des Routes
```typescript
export const routes: Routes = [
  { path: '', redirectTo: '/movies', pathMatch: 'full' },
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/new', component: MovieFormComponent },
  { path: 'movies/:id', component: MovieDetailComponent },
  { path: 'movies/:id/edit', component: MovieFormComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '/movies' } // Wildcard route
];
```

### Fonctionnalités:
- **Route de redirection**: `''` → `'/movies'`
- **Route paramétrisée**: `:id` pour MovieDetail et MovieEdit
- **Route wildcard**: `**` pour gérer les URLs invalides
- **Navigation programmatique**: `router.navigate(['/movies'])`

## 4. Pipes Angular

### Pipes Prédéfinis Utilisés:
- `titlecase`: Convertit le type de film en majuscule initiale
- `date`: (si utilisé) Formatage des dates
- `json`: (développement) Debug des objets

### Pipes Personnalisés Créés:

#### FilterMoviesPipe
```typescript
@Pipe({ name: 'filterMovies' })
// Filtre les films par titre, genre, acteurs
transform(movies: Movie[], searchTerm: string, filterType: string): Movie[]
```

#### DurationFormatPipe
```typescript
@Pipe({ name: 'durationFormat' })
// Convertit 135 minutes → "2h 15m"
transform(value: number | string, format: 'short' | 'long'): string
```

#### RatingStarsPipe
```typescript
@Pipe({ name: 'ratingStars' })
// Convertit 8.5/10 → "★★★★⯨"
transform(rating: number, maxStars: number = 5): string
```

## 5. Directives Angular

### Directives Prédéfinies Utilisées:
- `*ngFor`: Itération sur les listes
- `*ngIf`: Affichage conditionnel
- `[ngModel]`: Two-way binding pour les formulaires
- `[class]`: Binding de classes CSS
- `[routerLink]`: Navigation

### Directives Personnalisées Créées:

#### HighlightDirective
```typescript
@Directive({ selector: '[appHighlight]' })
// Surligne un élément au survol avec couleur configurable
@Input() appHighlight: string // Couleur de surbrillance
@HostListener('mouseenter') // Détecte le survol
```

#### RatingValidatorDirective
```typescript
@Directive({ selector: '[appRatingValidator]' })
// Valide que la note est entre 0 et 10
implements Validator
validate(control: AbstractControl): ValidationErrors | null
```

#### TooltipDirective
```typescript
@Directive({ selector: '[appTooltip]' })
// Affiche un tooltip au survol
@Input() appTooltip: string // Texte du tooltip
@Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right'
```

## 6. Formulaires Réactifs et Validation

### FormBuilder et FormGroup
```typescript
this.movieForm = this.fb.group({
  title: ['', [Validators.required, Validators.minLength(1)]],
  year: ['', [Validators.required, Validators.min(1900), Validators.max(2025)]],
  genre: this.fb.array([], Validators.required),
  rating: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
  poster: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
  synopsis: ['', Validators.required],
  cast: ['', Validators.required],
  type: ['movie', Validators.required],
  duration: ['', Validators.required]
});
```

### Types de Validateurs:
- **required**: Champ obligatoire
- **min/max**: Valeurs numériques min/max
- **minLength**: Longueur minimale de chaîne
- **pattern**: Expression régulière (URL)
- **Validateur personnalisé**: RatingValidatorDirective

### FormArray pour les checkboxes de genre
```typescript
get genreArray(): FormArray {
  return this.movieForm.get('genre') as FormArray;
}
```

## 7. Services HTTP et json-server

### Configuration HttpClient
```typescript
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient()]
};
```

### Utilisation dans MovieService
```typescript
constructor(private http: HttpClient) {}

// GET
getMovies(): Observable<Movie[]> {
  return this.http.get<Movie[]>('http://localhost:3000/movies');
}

// POST
addMovie(movie): Observable<Movie> {
  return this.http.post<Movie>('http://localhost:3000/movies', movie);
}

// PUT
updateMovie(id, movie): Observable<Movie> {
  return this.http.put<Movie>(`http://localhost:3000/movies/${id}`, movie);
}

// DELETE
deleteMovie(id): Observable<void> {
  return this.http.delete<void>(`http://localhost:3000/movies/${id}`);
}
```

### Commandes json-server
```bash
# Lancer le serveur
npm run server

# Le serveur écoute sur http://localhost:3000
# Endpoints disponibles:
# GET    /movies
# GET    /movies/:id
# POST   /movies
# PUT    /movies/:id
# DELETE /movies/:id
```

## 8. Observables et RxJS

### BehaviorSubject pour partager l'état
```typescript
private moviesSubject: BehaviorSubject<Movie[]> = new BehaviorSubject<Movie[]>([]);

getMovies(): Observable<Movie[]> {
  return this.moviesSubject.asObservable();
}
```

### Opérateurs RxJS utilisés:
- **map**: Transformer les données
- **tap**: Effets de bord (mise à jour du BehaviorSubject)
- **catchError**: Gestion des erreurs HTTP
- **subscribe**: Écouter les changements

### Avantages des Observables:
- Gestion asynchrone
- Réactivité en temps réel
- Annulation (unsubscribe)
- Opérateurs puissants pour transformation

## 9. Standalone Components (Angular 20)

Notre projet utilise Standalone Components au lieu de NgModules:
```typescript
@Component({
  selector: 'app-movie-card',
  standalone: true, // Composant autonome
  imports: [CommonModule, RouterLink, RatingStarsPipe],
  // ...
})
```

### Avantages:
- Moins de code boilerplate
- Imports plus explicites
- Meilleure tree-shaking
- Architecture moderne d'Angular

## 10. Tailwind CSS et Design

### Configuration personnalisée:
- Palette de couleurs: `primary`, `accent`, `dark`
- Animations: `fade-in`, `slide-up`, `pulse-slow`
- Effets: `glassmorphism`, `glow`, `backdrop-blur`

### Classes Tailwind utilisées:
- **Layout**: `grid`, `flex`, `container`
- **Responsive**: `md:`, `lg:`, `xl:`
- **Interactivité**: `hover:`, `focus:`, `transition`
- **Couleurs**: `bg-gray-800`, `text-yellow-400`
