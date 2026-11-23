import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { Actor, Movie } from '../../models/movie.models';
import { MovieService } from '../../services/movie.services';
import { OscarTypePipe } from '../../pipes/oscar-type.pipe';
import { byTitle } from '../../utlis/movie-utils';

interface DetailsView {
  movie: Movie;
  oscars: Movie['oscars'];
  cast: { actor: string; character: string; actorId?: string }[];
  sameGenre: Movie[];
  sameDirector: Movie[];
  sameActor: Movie[];
}

@Component({
  selector: 'app-movie-details',
  imports: [RouterLink, OscarTypePipe],
  templateUrl: './movie-details.component.html',
})
export class MovieDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly movieService = inject(MovieService);

  /**
   * paramMap is an Observable: clicking a "similar movie" link changes :id
   * while we stay on this component, so we react to every new id.
   * switchMap cancels the previous request. toSignal unsubscribes automatically.
   * undefined = loading, null = not found
   */
  view = toSignal(
    this.route.paramMap.pipe(
      map(params => params.get('id')!),
      switchMap(id =>
        forkJoin({
          movie: this.movieService.getMovie(id),
          movies: this.movieService.getMovies(),
          actors: this.movieService.getActors(),
        }).pipe(
          map(({ movie, movies, actors }) => this.buildView(movie, movies, actors)),
          catchError(() => of(null))                // 404 -> "not found"
        )
      )
    )
  );

  delete(movie: Movie): void {
    if (!confirm(`Are you sure you want to delete "${movie.title}"?`)) return;
    this.movieService.deleteMovie(movie.id).subscribe(() => this.router.navigate(['/movies']));
  }

  private buildView(movie: Movie, movies: Movie[], actors: Actor[]): DetailsView {
    const others = movies.filter(m => m.id !== movie.id);
    const actorIds = new Map(actors.map(a => [a.name, a.id]));
    const castNames = movie.cast.map(c => c.actor);

    return {
      movie,
      oscars: [...movie.oscars].sort((a, b) => a.type.localeCompare(b.type)),
      cast: movie.cast
        .map(c => ({ ...c, actorId: actorIds.get(c.actor) }))
        .sort((a, b) => a.actor.localeCompare(b.actor)),
      sameGenre: others.filter(m => m.genres.some(g => movie.genres.includes(g))).sort(byTitle),
      sameDirector: others.filter(m => movie.director && m.director === movie.director).sort(byTitle),
      sameActor: others.filter(m => m.cast.some(c => castNames.includes(c.actor))).sort(byTitle),
    };
  }
}