import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
    searchQuery: string = '';

    constructor(private router: Router) { }

    onSearch() {
        this.router.navigate(['/movies'], { queryParams: { search: this.searchQuery } });
    }
}
