import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MovieService } from '../../services/movie.services';

/** Template-driven form (ngModel), to show the second form style */
@Component({
  selector: 'app-cast-create',
  imports: [FormsModule, RouterLink],
  template: `
    <h2>Add cast member</h2>
    <form #castForm="ngForm" (ngSubmit)="save(castForm)" class="form">
      <label>Actor *
        <input name="actor" [(ngModel)]="actor" #actorCtrl="ngModel" required>
        @if (actorCtrl.invalid && actorCtrl.touched) { <span class="error">Actor is required</span> }
      </label>
      <label>Character *
        <input name="character" [(ngModel)]="character" #charCtrl="ngModel" required>
        @if (charCtrl.invalid && charCtrl.touched) { <span class="error">Character is required</span> }
      </label>
      <button type="submit" class="btn btn-primary" [disabled]="castForm.invalid">Save</button>
      <a [routerLink]="['/movies', movieId]">Cancel</a>
    </form>
  `,
})
export class CastCreateComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly movieService = inject(MovieService);

  movieId = this.route.snapshot.paramMap.get('id')!;   // read once: this page has no links to other movies
  actor = '';
  character = '';

  save(form: NgForm): void {
    if (form.invalid) return;
    this.movieService
      .addCastMember(this.movieId, { actor: this.actor.trim(), character: this.character.trim() })
      .subscribe({
        next: () => this.router.navigate(['/movies', this.movieId]),
        error: () => alert('Could not add the cast member'),
      });
  }
}