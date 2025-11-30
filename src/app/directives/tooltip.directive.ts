import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appTooltip]',
    standalone: true
})
export class TooltipDirective {
    /**
     * Texte du tooltip à afficher
     */
    @Input() appTooltip: string = '';

    /**
     * Position du tooltip: 'top', 'bottom', 'left', 'right'
     */
    @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';

    private tooltipElement: HTMLElement | null = null;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2
    ) { }

    /**
     * Affiche le tooltip au survol
     */
    @HostListener('mouseenter') onMouseEnter() {
        if (!this.appTooltip) return;

        // Créer l'élément tooltip
        this.tooltipElement = this.renderer.createElement('div');
        this.renderer.appendChild(this.tooltipElement, this.renderer.createText(this.appTooltip));

        // Styles du tooltip
        this.renderer.setStyle(this.tooltipElement, 'position', 'absolute');
        this.renderer.setStyle(this.tooltipElement, 'backgroundColor', 'rgba(0, 0, 0, 0.85)');
        this.renderer.setStyle(this.tooltipElement, 'color', 'white');
        this.renderer.setStyle(this.tooltipElement, 'padding', '8px 12px');
        this.renderer.setStyle(this.tooltipElement, 'borderRadius', '6px');
        this.renderer.setStyle(this.tooltipElement, 'fontSize', '12px');
        this.renderer.setStyle(this.tooltipElement, 'zIndex', '9999');
        this.renderer.setStyle(this.tooltipElement, 'whiteSpace', 'nowrap');
        this.renderer.setStyle(this.tooltipElement, 'boxShadow', '0 2px 8px rgba(0,0,0,0.2)');
        this.renderer.setStyle(this.tooltipElement, 'transition', 'opacity 0.2s ease-in-out');
        this.renderer.setStyle(this.tooltipElement, 'opacity', '0');

        // Ajouter au DOM
        this.renderer.appendChild(document.body, this.tooltipElement);

        // Positionner le tooltip
        this.positionTooltip();

        // Animation d'apparition
        setTimeout(() => {
            if (this.tooltipElement) {
                this.renderer.setStyle(this.tooltipElement, 'opacity', '1');
            }
        }, 10);
    }

    /**
     * Cache le tooltip quand la souris sort
     */
    @HostListener('mouseleave') onMouseLeave() {
        if (this.tooltipElement) {
            this.renderer.removeChild(document.body, this.tooltipElement);
            this.tooltipElement = null;
        }
    }

    /**
     * Positionne le tooltip selon la position spécifiée
     */
    private positionTooltip() {
        if (!this.tooltipElement) return;

        const hostRect = this.el.nativeElement.getBoundingClientRect();
        const tooltipRect = this.tooltipElement.getBoundingClientRect();
        const gap = 10; // Espace entre l'élément et le tooltip

        let top = 0;
        let left = 0;

        switch (this.tooltipPosition) {
            case 'top':
                top = hostRect.top - tooltipRect.height - gap;
                left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = hostRect.bottom + gap;
                left = hostRect.left + (hostRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
                left = hostRect.left - tooltipRect.width - gap;
                break;
            case 'right':
                top = hostRect.top + (hostRect.height - tooltipRect.height) / 2;
                left = hostRect.right + gap;
                break;
        }

        this.renderer.setStyle(this.tooltipElement, 'top', `${top + window.scrollY}px`);
        this.renderer.setStyle(this.tooltipElement, 'left', `${left + window.scrollX}px`);
    }

    /**
     * Nettoyage au cas où la directive est détruite avec un tooltip actif
     */
    ngOnDestroy() {
        if (this.tooltipElement) {
            this.renderer.removeChild(document.body, this.tooltipElement);
        }
    }
}
