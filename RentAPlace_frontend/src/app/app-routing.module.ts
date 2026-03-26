import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { PropertyList } from './components/property-list/property-list';
import { PropertyDetail } from './components/property-detail/property-detail';
import { OwnerDashboard } from './components/owner-dashboard/owner-dashboard';
import { RenterDashboard } from './components/renter-dashboard/renter-dashboard';
import { AddProperty } from './components/add-property/add-property';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { MyReservations } from './components/my-reservations/my-reservations';
import { Messages } from './components/messages/messages';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'properties', component: PropertyList },
  { path: 'properties/:id', component: PropertyDetail },
  {
    path: 'owner-dashboard',
    component: OwnerDashboard,
    canActivate: [RoleGuard],
    data: { roles: ['Owner'] }
  },
  {
    path: 'renter-dashboard',
    component: RenterDashboard,
    canActivate: [RoleGuard],
    data: { roles: ['Renter'] }
  },
  {
    path: 'add-property',
    component: AddProperty,
    canActivate: [RoleGuard],
    data: { roles: ['Owner'] }
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'my-reservations',
    component: MyReservations,
    canActivate: [AuthGuard]
  },
  {
    path: 'messages',
    component: Messages,
    canActivate: [AuthGuard]
  },
  { path: 'edit-property/:id', component: AddProperty },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }