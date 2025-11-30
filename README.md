# Movie Explorer - Angular Application

Application Angular moderne pour explorer et gérer une collection de films et séries avec une interface utilisateur premium utilisant Tailwind CSS.


## 🚀 Installation et Démarrage

### Prérequis
- Node.js (v18 ou supérieur)
- npm (v9 ou supérieur)

### Installation des dépendances
```bash
npm install
```

### Démarrage de l'application

#### Option 1: Tout en un (Recommandé)
```bash
npm run dev
```
Cette commande démarre simultanément:
- json-server sur http://localhost:3000
- Angular sur http://localhost:4200

#### Option 2: Séparé
Terminal 1 - Backend (json-server):
```bash
npm run server
```

Terminal 2 - Frontend (Angular):
```bash
npm start
```

### Build de production
```bash
npm run build
```

### Tests
```bash
npm test
```

## 📁 Structure du Projet

```
movie-explorer/
├── src/
│   ├── app/
│   │   ├── components/          # Composants réutilisables
│   │   │   ├── navbar/
│   │   │   ├── movie-card/
│   │   │   ├── movie-form/
│   │   │   └── confirm-dialog/
│   │   ├── pages/               # Pages/Vues
│   │   │   ├── movie-list/
│   │   │   ├── movie-detail/
│   │   │   ├── favorites/
│   │   │   └── dashboard/
│   │   ├── services/            # Services Angular
│   │   │   └── movie.service.ts
│   │   ├── pipes/               # Pipes personnalisés
│   │   │   ├── filter-movies.pipe.ts
│   │   │   ├── duration-format.pipe.ts
│   │   │   └── rating-stars.pipe.ts
│   │   ├── directives/          # Directives personnalisées
│   │   │   ├── highlight.directive.ts
│   │   │   ├── rating-validator.directive.ts
│   │   │   └── tooltip.directive.ts
│   │   ├── models/              # Modèles TypeScript
│   │   │   └── movie.model.ts

│   │   ├── app.routes.ts        # Configuration routing
│   │   └── app.config.ts        # Configuration app
│   └── styles.css               # Styles globaux
├── db.json                      # Base de données json-server
├── tailwind.config.js           # Configuration Tailwind
├── ANSWERS.md                   # Réponses aux questions de cours
└── package.json
```

## 🎨 Fonctionnalités

### ✨ Fonctionnalités Principales
- **CRUD Complet**: Créer, lire, modifier, supprimer des films/séries
- **Système de Favoris**: Marquer des films comme favoris (persistant)
- **Recherche**: Rechercher par titre, genre, acteurs
- **Filtrage**: Filtrer par genre
- **Tri**: Trier par note ou année
- **Dashboard**: Statistiques (total films, favoris, genres, note moyenne)
- **Routing**: Navigation fluide entre pages

### 🎯 Pipes Personnalisés
1. **FilterMoviesPipe**: Filtre les films par recherche (titre, genre, cast)
2. **DurationFormatPipe**: Formate la durée (135 min → "2h 15m")
3. **RatingStarsPipe**: Affiche les notes en étoiles (8.5 → "★★★★⯨")

### 🔧 Directives Personnalisées
1. **HighlightDirective**: Surligne au survol avec couleur configurable
2. **RatingValidatorDirective**: Valide les notes (0-10, max 1 décimale)
3. **TooltipDirective**: Affiche des tooltips avec positionnement configurable

### 📊 Composants (8 total)
1. **AppComponent**: Composant racine
2. **NavbarComponent**: Barre de navigation
3. **MovieCardComponent**: Carte de film (réutilisable)
4. **MovieFormComponent**: Formulaire création/édition
5. **ConfirmDialogComponent**: Dialogue de confirmation
6. **MovieListComponent**: Liste de films avec filtres
7. **MovieDetailComponent**: Détails complets d'un film
8. **DashboardComponent**: Tableau de bord statistiques
9. **FavoritesComponent**: Page des favoris

### 🎨 Design Tailwind
- **Palette personnalisée**: Colors primary, accent, dark
- **Animations**: fade-in, slide-up, pulse-slow
- **Effets**: glassmorphism, glow, backdrop-blur
- **Responsive**: Mobile-first design
- **Mode sombre**: Interface sombre premium

## 🛠️ Technologies Utilisées

- **Angular 18+**: Framework frontend
- **TypeScript**: Langage principal
- **Tailwind CSS**: Styling
- **RxJS**: Programmation réactive
- **json-server**: API REST mock
- **Standalone Components**: Architecture moderne sans NgModules

## 📝 Formulaires et Validation

Le formulaire utilise Reactive Forms avec validations:
- **Title**: Obligatoire, longueur min 1
- **Year**: Obligatoire, entre 1900 et année actuelle
- **Genre**: Au moins un genre sélectionné (FormArray)
- **Rating**: Obligatoire, entre 0 et 10
- **Poster**: URL valide (pattern regex)
- **Synopsis**: Obligatoire
- **Cast**: Obligatoire (séparé par virgules)
- **Type**: Movie ou Series
- **Duration**: Obligatoire

## 🌐 API Endpoints (json-server)

- `GET /movies` - Liste tous les films
- `GET /movies/:id` - Détails d'un film
- `POST /movies` - Créer un film
- `PUT /movies/:id` - Modifier un film
- `DELETE /movies/:id` - Supprimer un film
- `GET /favorites` - Liste des IDs favoris (objet `{ids: [...]}`)
- `PUT /favorites` - Mettre à jour les favoris

## 📖 Documentation

Pour les réponses détaillées aux questions de cours, consultez [ANSWERS.md](./ANSWERS.md).

## 🎓 Auteur

Projet réalisé dans le cadre du cours Angular.

## 📄 Licence

Ce projet est à usage éducatif.
