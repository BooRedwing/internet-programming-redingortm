import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin, map } from 'rxjs';

import { Actor, Movie } from '../../models/movie.models';
import { MovieService } from '../../services/movie.services';
import { countBy, formatOscarType } from '../../utlis/movie-utils';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
})
export class StatisticsComponent {
  private readonly movieService = inject(MovieService);

  stats = toSignal(
    forkJoin({
      movies: this.movieService.getMovies(),
      actors: this.movieService.getActors(),
      genres: this.movieService.getGenres(),
    }).pipe(map(({ movies, actors, genres }) => this.calculate(movies, actors, genres)))
  );

  private calculate(movies: Movie[], actors: Actor[], genres: string[]) {
    const actorNames = new Set(actors.map(a => a.name));
    const castNames = new Set(movies.flatMap(m => m.cast.map(c => c.actor)));
    const movieTitles = new Set(movies.map(m => m.title));
    const notableWorks = new Set(actors.flatMap(a => a.notableWorks));

    const actorsWithoutDetails = [...castNames].filter(n => !actorNames.has(n)).sort();
    const moviesWithoutDetails = [...notableWorks].filter(t => !movieTitles.has(t)).sort();

    return {
      totalMovies: movies.length,
      totalActors: actors.length,
      totalGenres: genres.length,
      totalOscars: movies.reduce((sum, m) => sum + m.oscars.length, 0),
      oscarsPerType: countBy(movies, m => m.oscars.map(o => formatOscarType(o.type))),
      // each oscar counts once for every genre of its movie
      oscarsPerGenre: countBy(movies, m => m.genres.flatMap(g => m.oscars.map(() => g))),
      moviesPerDecade: countBy(movies.filter(m => m.year), m => [`${Math.floor(m.year! / 10) * 10}s`]),
      moviesPerGenre: countBy(movies, m => m.genres),
      actorsWithoutDetails,
      moviesWithoutDetails,
    };
  }
}