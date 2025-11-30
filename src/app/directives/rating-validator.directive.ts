import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
    selector: '[appRatingValidator]',
    standalone: true,
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => RatingValidatorDirective),
            multi: true
        }
    ]
})
export class RatingValidatorDirective implements Validator {
    /**
     * Valide que la note est un nombre valide entre 0 et 10
     * @param control - Contrôle du formulaire à valider
     * @returns Erreurs de validation ou null si valide
     */
    validate(control: AbstractControl): ValidationErrors | null {
        const value = control.value;

        // Si vide, laisser le validateur 'required' gérer
        if (value === null || value === undefined || value === '') {
            return null;
        }

        // Vérifier que c'est un nombre
        const numValue = Number(value);
        if (isNaN(numValue)) {
            return {
                'invalidRating': {
                    value: value,
                    message: 'La note doit être un nombre'
                }
            };
        }

        // Vérifier la plage (0-10)
        if (numValue < 0 || numValue > 10) {
            return {
                'ratingOutOfRange': {
                    value: numValue,
                    message: 'La note doit être entre 0 et 10'
                }
            };
        }

        // Vérifier que la note a au maximum 1 décimale
        const decimalPart = (numValue.toString().split('.')[1] || '');
        if (decimalPart.length > 1) {
            return {
                'tooManyDecimals': {
                    value: numValue,
                    message: 'La note ne peut avoir qu\'une seule décimale maximum'
                }
            };
        }

        // Validation réussie
        return null;
    }
}
