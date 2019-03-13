import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { isDevMode } from '@angular/core';
import { Subject } from 'rxjs';

import {timer as observableTimer, Observable} from 'rxjs';

import {mergeMap} from 'rxjs/operators';
// Copyright 2017, 2018, 2019 David Hoelzer/Enclave Forensics Corporation - All Rights Reserved
// No portion of this code may be used in any commercial product without first notifying Enclave Forensics Corporation
// and clear attribution and credit for portions copied or otherwise utilized.

import { Statistics } from './models/Statistics';

export class Message {
    constructor(
        public apiEndpoint: string,
        public parameters: {},
    ) { }
}



@Injectable()
export class SilkQueryService {
  private socket: WebSocketSubject<any>
  authenticated$ = new Subject<boolean>()
  serverMessage$ = new Subject<string>()
  statusMessage$ = new Subject<string>()
  topTalkers$ = new Subject<string>()
  topTCPConnections$ = new Subject<string>()
  private ws: string
  private url = '';

  authToken = "Deprecated"

  constructor(private http: HttpClient) {
    this.authenticated$.next(false)
    this.serverMessage$.next("")
    if(isDevMode() == false) { 
      this.url = ''
      this.ws = 'ws://'+window.location.hostname
    }
    else { 
      console.log("In development mode")
      this.url = "http://127.0.0.1:3000"
      this.ws = "ws://127.0.0.1:3000"
    }
    this.socket = webSocket(this.ws)
  this.socket.subscribe(message => this.socketMessage(message))
  }

  socketMessage(message)
  {
    var messageObject = message
    if(messageObject.hasOwnProperty("message")){
      this.statusMessage$.next(messageObject.message)
    }
    switch(messageObject.apiEndpoint)
    {
      case 'login':
        this.authenticated$.next(messageObject.result as boolean)
        break
      case 'toptalkers':
        this.topTalkers$.next(messageObject.result as string)
        break
      case 'topTCPConnections':
        this.topTCPConnections$.next(messageObject.result as string)
        break
    }
  }

  attemptLogin(username, password)
  {
    var message = new Message("login", {"username":username, "password":password})
    this.socket.next(message)
  }

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
  }

  checkAuthenticated()
  {
    return this.http.get(this.url + '/api/authenticated?auth='+this.authToken);
  }

  TopTCPPorts()
  {
    return observableTimer(0,60000).pipe(mergeMap((i) =>this.http.get(this.url + '/api/10MinuteTCPPorts?auth='+this.authToken)));
  }
  Stats30Days() {
    return observableTimer(0,3600000).pipe(mergeMap((i) =>this.http.get(this.url + '/api/30DayStats?auth='+this.authToken)));
  }

  Stats24Hours() {
    return observableTimer(0,360000).pipe(mergeMap((i) =>this.http.get(this.url + '/api/24HourStats?auth='+this.authToken)));
  }

  Stats60Minutes() {
    return observableTimer(0,60000).pipe(mergeMap((i) =>this.http.get(this.url + '/api/60MinuteStats?auth='+this.authToken)));
  }

  topTalkers() {
    var message = new Message("toptalkers",{})
    this.socket.next(message)
  }

  largestTransfers() {
  	return observableTimer(0,600000).pipe(mergeMap((i) => this.http.get(this.url + '/api/largestTransfers?auth='+this.authToken)));
  }

  topTCPConnections() {
    var message = new Message("topTCPConnections", {})
    this.socket.next(message)
  }
}
