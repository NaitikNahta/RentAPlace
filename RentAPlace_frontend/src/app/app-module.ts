import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { App } from './app';
import { Navbar } from './components/navbar/navbar';
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

@NgModule({
  declarations: [
    App,
    Navbar,
    Home,
    Login,
    Register,
    PropertyList,
    PropertyDetail,
    OwnerDashboard,
    RenterDashboard,
    AddProperty,
    AdminDashboard,
    MyReservations,
    Messages
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [App]
})
export class AppModule { }