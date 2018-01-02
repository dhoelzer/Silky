// Copyright 2017, David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
// No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation
// and clear attribution and credit for portions copied or otherwise utilized.

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { SilkQueryService } from './silk-query.service';
import { TopTalkersComponent } from './displays/topTalkers.component';
import { StatisticsComponent } from './displays/statistics.component';
import { TopTCPPortsComponent } from './displays/topTCPPorts.component';

import { LargeTransfer } from './models/largeTransfer';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    TopTalkersComponent,
    StatisticsComponent,
    TopTCPPortsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [SilkQueryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
