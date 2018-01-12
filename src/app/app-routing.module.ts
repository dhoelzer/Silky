// Copyright 2017, David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
// No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation
// and clear attribution and credit for portions copied or otherwise utilized.

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { UserServiceService } from './user-service.service';

const routes: Routes = [
	{
		path: 'home',
		component: HomeComponent,
		canActivate: [UserServiceService]
	},
	{
		path: 'about',
		component: AboutComponent
	},
	{
		path: 'login',
		component: LoginComponent
	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule{ }