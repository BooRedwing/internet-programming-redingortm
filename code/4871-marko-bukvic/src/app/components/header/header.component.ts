import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  routes = [
    { linkName: 'Movies', url: '/movies' },
    { linkName: 'Add movie', url: '/movies/create' },
    { linkName: 'Statistics', url: '/statistics' },
    { linkName: 'About', url: '/about' },
  ];
}