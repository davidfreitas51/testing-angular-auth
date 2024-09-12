import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SecretComponent } from './secret/secret.component';
import { WorkerComponent } from './worker/worker.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard'; 

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'secret', 
    component: SecretComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['user', 'worker', 'admin'] }
  },
  { 
    path: 'worker', 
    component: WorkerComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['worker', 'admin'] } 
  },
  { 
    path: 'admin', 
    component: AdminComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['admin'] } 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
