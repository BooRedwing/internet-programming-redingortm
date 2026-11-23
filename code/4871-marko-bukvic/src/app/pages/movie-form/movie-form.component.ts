import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Movie, MovieInput } from '../../models/movie.models';
import { formatOscarType, toOscarKey } from '../../utlis/movie-utils';

/** One reactive form for BOTH create and edit. Parent -> child: @Input, child -> parent: @Output. */
@Component({
  selector: 'app-movie-form',
  imports: [ReactiveFormsModule],
  templateUrl: './movie-form.component.html',
})
export class MovieFormComponent {
  private readonly fb = inject(FormBuilder);

  @Input() genres: string[] = [];
  @Input() idText = '(generated on save)';
  @Input() cast: Movie['cast'] = [];          // the form doesn't edit the cast, but must keep it

  /** When the edit page passes a movie in, fill the form with it */
  @Input() set movie(movie: Movie | null) {
    if (!movie) return;
    this.form.patchValue({
      title: movie.title,
      year: movie.year,
      plot: movie.plot,
      director: movie.director,
      genres: movie.genres,
      rating: movie.rating,
    });
    this.oscars.clear();
    [...movie.oscars]
      .sort((a, b) => a.type.localeCompare(b.type))
      .forEach(o => this.oscars.push(this.oscarRow(formatOscarType(o.type), o.recipient)));
    this.cast = movie.cast;
  }

  @Output() save = new EventEmitter<MovieInput>();

  form = this.fb.group({
    title: ['', Validators.required],
    year: [null as number | null, [Validators.required, Validators.min(1888), Validators.max(2100)]],
    plot: [''],
    director: ['', Validators.required],
    genres: [[] as string[]],
    rating: [null as number | null, [Validators.min(0), Validators.max(10)]],
    oscars: this.fb.array<FormGroup>([]),
  });

  get oscars(): FormArray<FormGroup> {
    return this.form.controls.oscars;
  }

  addOscar(): void {
    this.oscars.push(this.oscarRow('', ''));
  }

  removeOscar(index: number): void {
    this.oscars.removeAt(index);
  }

  /** show an error only after the user touched the field */
  invalid(name: 'title' | 'year' | 'director' | 'rating'): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.save.emit({
      title: v.title!.trim(),
      year: v.year,
      plot: v.plot ?? '',
      director: v.director!.trim(),
      genres: v.genres ?? [],
      rating: v.rating,
      cast: this.cast,
      oscars: (v.oscars as { type: string; recipient: string }[])
        .filter(o => o.type.trim())
        .map(o => ({ type: toOscarKey(o.type), recipient: o.recipient }))
        .sort((a, b) => a.type.localeCompare(b.type)),
    });
  }

  private oscarRow(type: string, recipient: string): FormGroup {
    return this.fb.nonNullable.group({
      type: [type, Validators.required],
      recipient: [recipient, Validators.required],
    });
  }
}