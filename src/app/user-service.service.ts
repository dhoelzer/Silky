import { Injectable } from '@angular/core';
import {CanActivate} from "@angular/router";
import { SilkQueryService } from './silk-query.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class UserServiceService implements CanActivate{

  private url = 'http://192.168.2.18:3000';
  authenticated: boolean;

  constructor(private silk: SilkQueryService, private router: Router, private http: HttpClient) {
  	this.authenticated = false;
  }

  attemptLogin(username, password)
  {
    var result = <any>[]
    var request = this.http.post(this.url+'/api/login', {"username": username, "password": password}).subscribe(data => {
      this.silk.setAuthToken(data["authToken"])
      if(data["authToken"]){ this.authenticated = true; }
      if(this.authenticated) {
        console.log("Success")
        this.router.navigate(['home'])
      }
  }
}

  canActivate() {

  	console.log(this.authenticated);
    return this.authenticated
    
  }


}
