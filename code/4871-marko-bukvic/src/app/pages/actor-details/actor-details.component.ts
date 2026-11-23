import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { MovieService } from '../../services/movie.services';

@Component({
  selector: 'app-actor-details',
  imports: [RouterLink],
  template: `
    @if (view() === undefined) {
      <p>Loading...</p>
    } @else if (view() === null) {
      <p>Actor not found.</p>
    } @else {
      @let v = view()!;
      <h2>{{ v.actor.name }}</h2>
      <dl class="details">
        <dt>ID</dt><dd>{{ v.actor.id }}</dd>
        <dt>Name</dt><dd>{{ v.actor.name }}</dd>
        <dt>Birthdate</dt><dd>{{ v.actor.birthdate }}</dd>
        <dt>Height</dt><dd>{{ v.actor.height !== null ? v.actor.height + ' cm' : '' }}</dd>
        <dt>Nationality</dt><dd>{{ v.actor.nationality }}</dd>
        <dt>Notable works</dt>
        <dd>
          <ul>
            @for (work of v.works; track work.title) {
              <li>
                @if (work.movieId) { <a [routerLink]="['/movies', work.movieId]">{{ work.title }}</a> }
                @else { {{ work.title }} }
              </li>
            }
          </ul>
        </dd>
      </dl>
    }
  `,
})
export class ActorDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly movieService = inject(MovieService);

  view = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')!),
      switchMap(id =>
        forkJoin({ actor: this.movieService.getActor(id), movies: this.movieService.getMovies() }).pipe(
          map(({ actor, movies }) => {
            const idByTitle = new Map(movies.map(m => [m.title, m.id]));
            return {
              actor,
              works: [...actor.notableWorks]
                .sort((a, b) => a.localeCompare(b))
                .map(title => ({ title, movieId: idByTitle.get(title) })),
            };
          }),
          catchError(() => of(null))
        )
      )
    )
  );
}