import { Injectable } from '@angular/core';
import { SilkQueryService } from './silk-query.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable()
export class UserServiceService {

  private url = 'http://192.168.2.18:3000';
  authenticated: boolean;

  constructor(private silk: SilkQueryService,  private http: HttpClient) {
  	this.authenticated = false;
  }

  attemptLogin(username, password)
  {
    return this.http.post(this.url+'/api/login', {"username": username, "password": password})
}


}
