import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { isDevMode } from '@angular/core';
import { Subject } from 'rxjs';

export class Message {
    constructor(
        public apiEndpoint: string,
        public parameters: {},
    ) { }
}

@Injectable()
export class UserServiceService {
  private socket: WebSocketSubject<any>
  authenticated$ = new Subject<boolean>()
  serverMessage$ = new Subject<string>()
  statusMessage$ = new Subject<string>()
  url = ""
  private ws: string


  constructor(private http: HttpClient) {
  	this.authenticated$.next(false)
    this.serverMessage$.next("")
    if(isDevMode() == false) { 
      this.url = ''
      this.ws = 'wss://'+window.location.hostname
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
		console.log(messageObject.result)
		this.authenticated$.next(messageObject.result as boolean)
        break
    }
  }

  attemptLogin(username, password)
  {
    var message = new Message("login", {"username":username, "password":password})
    this.socket.next(message)
  }


}
