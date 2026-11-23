import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';

import { Actor, ActorDto, CastMember, GenreDto, Movie, MovieDto, MovieInput } from '../models/movie.models';
import { toActor, toMovie, toMovieDto } from '../models/mappers';


@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';

  
  getMovies(): Observable<Movie[]> {
    return this.http.get<MovieDto[]>(`${this.apiUrl}/movies`).pipe(map(list => list.map(toMovie)));
  }

  getMovie(id: string): Observable<Movie> {
    return this.http.get<MovieDto>(`${this.apiUrl}/movies/${id}`).pipe(map(toMovie));
  }

  createMovie(movie: MovieInput): Observable<Movie> {
    return this.http.post<MovieDto>(`${this.apiUrl}/movies`, toMovieDto(movie)).pipe(map(toMovie));
  }

  updateMovie(movie: Movie): Observable<Movie> {
    return this.http
      .put<MovieDto>(`${this.apiUrl}/movies/${movie.id}`, { id: movie.id, ...toMovieDto(movie) })
      .pipe(map(toMovie));
  }

  deleteMovie(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/movies/${id}`);
  }

  
  addCastMember(movieId: string, member: CastMember): Observable<Movie> {
    return this.getMovie(movieId).pipe(
      switchMap(movie => this.updateMovie({ ...movie, cast: [...movie.cast, member] }))
    );
  }

  // ---------- genres ----------
  getGenres(): Observable<string[]> {
    return this.http.get<GenreDto[]>(`${this.apiUrl}/genres`).pipe(map(list => list.map(g => g.name)));
  }

  // ---------- actors ----------
  getActors(): Observable<Actor[]> {
    return this.http.get<ActorDto[]>(`${this.apiUrl}/actors`).pipe(map(list => list.map(toActor)));
  }

  getActor(id: string): Observable<Actor> {
    return this.http.get<ActorDto>(`${this.apiUrl}/actors/${id}`).pipe(map(toActor));
  }

  /** GET /actors?name=... returns an ARRAY; undefined if nobody has that name */
  getActorByName(name: string): Observable<Actor | undefined> {
    return this.http
      .get<ActorDto[]>(`${this.apiUrl}/actors`, { params: { name } })
      .pipe(map(list => (list.length ? toActor(list[0]) : undefined)));
  }
}