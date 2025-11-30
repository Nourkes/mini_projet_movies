import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'durationFormat',
    standalone: true
})
export class DurationFormatPipe implements PipeTransform {
    /**
     * Convertit une durée en minutes en format lisible (ex: 135 -> "2h 15m")
     * Ou retourne la durée telle quelle si c'est une chaîne (ex: "3 Seasons")
     * @param value - Durée en minutes (number) ou chaîne formatée
     * @param format - Format de sortie: 'short' (2h 15m) ou 'long' (2 heures 15 minutes)
     * @returns Durée formatée
     */
    transform(value: number | string | undefined, format: 'short' | 'long' = 'short'): string {
        if (!value) {
            return 'N/A';
        }

        // Si c'est déjà une chaîne formatée (ex: "3 Seasons"), retourner telle quelle
        if (typeof value === 'string') {
            return value;
        }

        // Convertir les minutes en heures et minutes
        const hours = Math.floor(value / 60);
        const minutes = value % 60;

        if (format === 'long') {
            if (hours > 0 && minutes > 0) {
                return `${hours} ${hours > 1 ? 'heures' : 'heure'} ${minutes} minutes`;
            } else if (hours > 0) {
                return `${hours} ${hours > 1 ? 'heures' : 'heure'}`;
            } else {
                return `${minutes} minutes`;
            }
        } else {
            // Format court par défaut
            if (hours > 0 && minutes > 0) {
                return `${hours}h ${minutes}m`;
            } else if (hours > 0) {
                return `${hours}h`;
            } else {
                return `${minutes}m`;
            }
        }
    }
}
