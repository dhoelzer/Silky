import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SilkQueryService } from '../silk-query.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = "";
  password: string = "";
  authed: boolean = false;
  @Output() authenticationNotice = new EventEmitter<boolean>();

  constructor(private silk:SilkQueryService) { }

  ngOnInit() {
    this.silk.authenticated$.subscribe(result => {
      this.authed = <boolean>result
      this.authenticationNotice.emit(this.authed)
    })
  }

  onSubmit(event) {
  	this.silk.attemptLogin(this.username, this.password)
  }
}
