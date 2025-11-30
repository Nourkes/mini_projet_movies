import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appHighlight]',
    standalone: true
})
export class HighlightDirective {
    /**
     * Couleur de surbrillance au survol (défaut: #fbbf24 - jaune doré)
     */
    @Input() appHighlight: string = '#fbbf24';

    /**
     * Couleur par défaut quand la souris n'est pas sur l'élément
     */
    @Input() defaultColor: string = 'transparent';

    /**
     * Durée de la transition en ms
     */
    @Input() transitionDuration: string = '300ms';

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) {
        // Initialiser avec la couleur par défaut
        this.setBackgroundColor(this.defaultColor);
    }

    /**
     * Gère l'événement mouseenter (survol)
     */
    @HostListener('mouseenter') onMouseEnter() {
        this.setBackgroundColor(this.appHighlight);
        // Ajouter un effet d'échelle pour plus d'interactivité
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1.02)');
    }

    /**
     * Gère l'événement mouseleave (sortie)
     */
    @HostListener('mouseleave') onMouseLeave() {
        this.setBackgroundColor(this.defaultColor);
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
    }

    /**
     * Applique une couleur de fond avec transition
     */
    private setBackgroundColor(color: string) {
        this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', color);
        this.renderer.setStyle(this.el.nativeElement, 'transition', `all ${this.transitionDuration} ease-in-out`);
    }
}
