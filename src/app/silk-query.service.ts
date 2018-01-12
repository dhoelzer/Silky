// Copyright 2017, David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
// No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation
// and clear attribution and credit for portions copied or otherwise utilized.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Statistics } from './models/Statistics';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/forkJoin';

@Injectable()
export class SilkQueryService {

  private url = 'http://192.168.2.18:3000';
  private authToken = "";

  constructor(private http: HttpClient) { }

  runQuery() {
  	console.log("Running query");
  	var result = this.http.get(this.url + '/api/food')

  	console.log(result)
  	return result

  }

    // You really won't see a greater granularity by refreshing more frequently, unless the network is pretty busy.
    // The Silk logger caches and writes out chunks, so unless that cache has filled you will keep getting HTTP 304 messages
    // until the data is updated on the disk.  If you wish to tune this, I'd suggest that you watch the charts run with
    // a network monitor open in Chrome to make sure you're not just seeing a stream of 304 messages, which is
    // really wasteful resources-wise.

  getAuthToken()
  {
    return this.getAuthToken
  }

  setAuthToken(token)
  {
    console.log("Token: "+token)
    this.authToken = token
  }

  attemptLogin(username, password)
  {
    var result = <any>[]
    var request = this.http.post(this.url+'/api/login', {"username": username, "password": password}).subscribe(data => {
      this.setAuthToken(data["authToken"])
      console.log(this.authToken)
      return true
    })
    return false
  }

  checkAuthenticated()
  {
    return this.http.get(this.url + '/api/authenticated?auth='+this.authToken);
  }

  TopTCPPorts()
  {
    return Observable.timer(0,60000).flatMap((i) =>this.http.get(this.url + '/api/10MinuteTCPPorts?auth='+this.authToken));
  }
  Stats30Days() {
    return Observable.timer(0,3600000).flatMap((i) =>this.http.get(this.url + '/api/30DayStats?auth='+this.authToken));
  }

  Stats24Hours() {
    return Observable.timer(0,360000).flatMap((i) =>this.http.get(this.url + '/api/24HourStats?auth='+this.authToken));
  }

  Stats60Minutes() {
    return Observable.timer(0,60000).flatMap((i) =>this.http.get(this.url + '/api/60MinuteStats?auth='+this.authToken));
  }

  topTalkers() {
  	return Observable.timer(0,600000).flatMap((i) => this.http.get(this.url + '/api/topTalkers?auth='+this.authToken));
  }

  largestTransfers() {
  	return Observable.timer(0,600000).flatMap((i) => this.http.get(this.url + '/api/largestTransfers?auth='+this.authToken));
  }

  topConnections() {
    return Observable.timer(0,300000).flatMap((i) => this.http.get(this.url + '/api/topTCPConnections?auth='+this.authToken));
  }
}
