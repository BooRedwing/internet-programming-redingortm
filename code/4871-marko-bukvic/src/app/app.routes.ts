import { Routes } from '@angular/router';

import { MovieListComponent } from './pages/movie-list/movie-list.component';
import { MovieCreateComponent } from './pages/movie-create/movie-create.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { MovieEditComponent } from './pages/movie-edit/movie-edit.component';
import { CastCreateComponent } from './pages/cast-create/cast-create.component';
import { ActorDetailsComponent } from './pages/actor-details/actor-details.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { AboutComponent } from './pages/about/about.component';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },        // home page = movie list
  {
    path: 'movies',
    children: [                                                  // child routes
      { path: '', component: MovieListComponent },
      { path: 'create', component: MovieCreateComponent },       // BEFORE ':id' !
      { path: ':id', component: MovieDetailsComponent },
      { path: ':id/edit', component: MovieEditComponent },
      { path: ':id/cast/add', component: CastCreateComponent },
    ],
  },
  { path: 'actor/:id', component: ActorDetailsComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: 'movies' },                          // unknown URL, always last
];
