// Copyright 2017, David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
// No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation
// and clear attribution and credit for portions copied or otherwise utilized.

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Statistics } from './models/Statistics';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class SilkQueryService {

  private url = 'http://192.168.2.18:3000';

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


  TopTCPPorts()
  {
    return Observable.timer(0,45000).flatMap((i) =>this.http.get(this.url + '/api/10MinuteTCPPorts'));
  }
  Stats30Days() {
    return Observable.timer(0,3600000).flatMap((i) =>this.http.get(this.url + '/api/30DayStats'));
  }

  Stats24Hours() {
    return Observable.timer(0,360000).flatMap((i) =>this.http.get(this.url + '/api/24HourStats'));
  }

  Stats60Minutes() {
    return Observable.timer(0,60000).flatMap((i) =>this.http.get(this.url + '/api/60MinuteStats'));
  }

  topTalkers() {
  	return Observable.timer(0,600000).flatMap((i) => this.http.get(this.url + '/api/topTalkers'));
  }

  largestTransfers() {
  	return Observable.timer(0,600000).flatMap((i) => this.http.get(this.url + '/api/largestTransfers'));
  }

  topConnections() {
    return Observable.timer(0,300000).flatMap((i) => this.http.get(this.url + '/api/topTCPConnections'));
  }
}
