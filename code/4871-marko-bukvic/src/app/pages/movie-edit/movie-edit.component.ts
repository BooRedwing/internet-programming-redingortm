import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';

import { Movie, MovieInput } from '../../models/movie.models';
import { MovieService } from '../../services/movie.services';
import { MovieFormComponent } from '../movie-form/movie-form.component';

@Component({
  selector: 'app-movie-edit',
  imports: [MovieFormComponent],
  template: `
    <h2>Edit movie</h2>
    @let m = movie();
    @if (m === undefined) {
      <p>Loading...</p>
    } @else if (m === null) {
      <p>Movie not found.</p>
    } @else {
      <app-movie-form [movie]="m" [idText]="m.id" [genres]="genres()" (save)="update(m, $event)" />
    }
  `,
})
export class MovieEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly movieService = inject(MovieService);

  genres = toSignal(this.movieService.getGenres(), { initialValue: [] });

  /** undefined = loading, null = not found */
  movie = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')!),
      switchMap(id => this.movieService.getMovie(id).pipe(catchError(() => of(null))))
    )
  );

  update(original: Movie, changes: MovieInput): void {
    this.movieService.updateMovie({ ...changes, id: original.id }).subscribe({
      next: saved => this.router.navigate(['/movies', saved.id]),       // back to the details page
      error: () => alert('Could not save the movie'),
    });
  }
}