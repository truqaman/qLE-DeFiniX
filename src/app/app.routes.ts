import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home';
import { DashboardComponent } from './components/dashboard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: '' }
];
