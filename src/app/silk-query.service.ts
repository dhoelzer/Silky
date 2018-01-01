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
