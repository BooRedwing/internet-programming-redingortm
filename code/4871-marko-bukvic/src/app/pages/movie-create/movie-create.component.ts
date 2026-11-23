import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { MovieInput } from '../../models/movie.models';
import { MovieService } from '../../services/movie.services';
import { MovieFormComponent } from '../movie-form/movie-form.component';

@Component({
  selector: 'app-movie-create',
  imports: [MovieFormComponent],
  template: `
    <h2>Add movie</h2>
    <app-movie-form [genres]="genres()" (save)="create($event)" />
  `,
})
export class MovieCreateComponent {
  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);

  genres = toSignal(this.movieService.getGenres(), { initialValue: [] });

  create(movie: MovieInput): void {
    this.movieService.createMovie(movie).subscribe({
      next: created => this.router.navigate(['/movies', created.id]),   // go to the new movie's details
      error: () => alert('Could not create the movie'),
    });
  }
}