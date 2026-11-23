import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Movie } from '../../models/movie.models';
import { MovieService } from '../../services/movie.services';

@Component({
  selector: 'app-movie-list',
  imports: [RouterLink],
  templateUrl: './movie-list.component.html',
})
export class MovieListComponent implements OnInit {
  private readonly movieService = inject(MovieService);

  movies = signal<Movie[]>([]);
  error = signal('');

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({          // HTTP completes after one response
      next: movies => this.movies.set(movies),
      error: () => this.error.set('Could not load movies. Is json-server running?'),
    });
  }

  deleteMovie(movie: Movie): void {
    if (!confirm(`Are you sure you want to delete "${movie.title}"?`)) return;
    this.movieService.deleteMovie(movie.id).subscribe({
      next: () => this.movies.update(list => list.filter(m => m.id !== movie.id)),
      error: () => alert('Delete failed'),
    });
  }
}