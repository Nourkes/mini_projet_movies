import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'ratingStars',
    standalone: true
})
export class RatingStarsPipe implements PipeTransform {
    /**
     * Convertit une note numérique (0-10) en représentation visuelle d'étoiles
     * @param rating - Note sur 10
     * @param maxStars - Nombre maximum d'étoiles (défaut: 5)
     * @returns Chaîne avec étoiles pleines (★), demi-étoiles (⯨) et étoiles vides (☆)
     */
    transform(rating: number, maxStars: number = 5): string {
        if (rating === null || rating === undefined || rating < 0) {
            return '☆☆☆☆☆';
        }

        // Convertir la note sur 10 en note sur maxStars
        const normalizedRating = (rating / 10) * maxStars;

        // Calculer le nombre d'étoiles pleines, demi-étoiles et vides
        const fullStars = Math.floor(normalizedRating);
        const hasHalfStar = normalizedRating % 1 >= 0.5;
        const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

        // Construire la chaîne d'étoiles
        let stars = '';

        // Ajouter les étoiles pleines
        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }

        // Ajouter une demi-étoile si nécessaire
        if (hasHalfStar) {
            stars += '⯨';
        }

        // Ajouter les étoiles vides
        for (let i = 0; i < emptyStars; i++) {
            stars += '☆';
        }

        return stars;
    }
}
