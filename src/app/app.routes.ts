import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MovieComponent } from './components/movie/movie.component';
import { TheaterComponent } from './components/theater/theater.component';
import { DetailMovieComponent } from './components/detail-movie/detail-movie.component';
import { DetailTheaterComponent } from './components/detail-theater/detail-theater.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CategoryComponent } from './components/category/category.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'movie', component: MovieComponent, canActivate: [AuthGuard] },
  {
    path: 'movie/:id',
    component: DetailMovieComponent,
    canActivate: [AuthGuard],
  },
  { path: 'theater', component: TheaterComponent, canActivate: [AuthGuard] },
  {
    path: 'theater/:id',
    component: DetailTheaterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/' },
];
