// Copyright 2017, David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
// No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation
// and clear attribution and credit for portions copied or otherwise utilized.

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Silky';
  version = '0.4'
  authenticated = false;
  showHome = true;
  showAbout = false;

  goHome(){
  	this.showAbout = false;
  	this.showHome = true;
  }
  goAbout(){
  	this.showAbout = true;
  	this.showHome = false;
  }

  authenticationEvent($event){
  	this.authenticated = $event
  }

}
