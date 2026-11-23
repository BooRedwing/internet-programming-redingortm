import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { Movie } from '../../models/movie.models';
import { MovieService } from '../../services/movie.services';
import { compareGenres, compareNumbers } from '../../utlis/movie-utils';

type SortColumn = 'id' | 'title' | 'year' | 'director' | 'genres' | 'oscars' | 'rating';

const COMPARE: Record<SortColumn, (a: Movie, b: Movie) => number> = {
  id: (a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }),   // "9" before "10"
  title: (a, b) => a.title.localeCompare(b.title),
  year: (a, b) => compareNumbers(a.year, b.year),
  director: (a, b) => a.director.localeCompare(b.director),
  genres: (a, b) => compareGenres(a.genres, b.genres),
  oscars: (a, b) => a.oscars.length - b.oscars.length,
  rating: (a, b) => compareNumbers(a.rating, b.rating),
};

@Component({
  selector: 'app-movie-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './movie-list.component.html',
})
export class MovieListComponent implements OnInit {
  private readonly movieService = inject(MovieService);

  movies = signal<Movie[]>([]);
  error = signal('');
  genres = toSignal(this.movieService.getGenres(), { initialValue: [] });  // auto-unsubscribes

  columns: { key: SortColumn; label: string }[] = [
    { key: 'id', label: 'ID' }, { key: 'title', label: 'Title' }, { key: 'year', label: 'Year' },
    { key: 'director', label: 'Director' }, { key: 'genres', label: 'Genre' },
    { key: 'oscars', label: 'Oscars' }, { key: 'rating', label: 'Rating' },
  ];

  // bonus: filters
  titleFilter = signal('');
  yearFilter = signal<number | null>(null);
  genreFilter = signal('');
  ratingFilter = signal<number | null>(null);

  // bonus: sorting
  sortColumn = signal<SortColumn | null>(null);
  sortAscending = signal(true);

  /** recalculated automatically whenever a signal it reads changes */
  visibleMovies = computed(() => {
    const title = this.titleFilter().trim().toLowerCase();
    const year = this.yearFilter();
    const genre = this.genreFilter();
    const rating = this.ratingFilter();

    const filtered = this.movies().filter(m =>
      (!title || m.title.toLowerCase().includes(title)) &&
      (year === null || m.year === year) &&
      (!genre || m.genres.includes(genre)) &&
      (rating === null || (m.rating ?? -1) >= rating)
    );

    const column = this.sortColumn();
    if (!column) return filtered;
    const direction = this.sortAscending() ? 1 : -1;
    return [...filtered].sort((a, b) => direction * COMPARE[column](a, b));
  });

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: movies => this.movies.set(movies),
      error: () => this.error.set('Could not load movies. Is json-server running?'),
    });
  }

  sortBy(column: SortColumn): void {
    if (this.sortColumn() === column) {
      this.sortAscending.update(asc => !asc);
    } else {
      this.sortColumn.set(column);
      this.sortAscending.set(true);
    }
  }

  arrow(column: SortColumn): string {
    if (this.sortColumn() !== column) return '';
    return this.sortAscending() ? '▲' : '▼';
  }

  clearFilters(): void {
    this.titleFilter.set('');
    this.yearFilter.set(null);
    this.genreFilter.set('');
    this.ratingFilter.set(null);
  }

  deleteMovie(movie: Movie): void {
    if (!confirm(`Are you sure you want to delete "${movie.title}"?`)) return;
    this.movieService.deleteMovie(movie.id).subscribe({
      next: () => this.movies.update(list => list.filter(m => m.id !== movie.id)),
      error: () => alert('Delete failed'),
    });
  }
}