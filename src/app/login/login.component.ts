import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserServiceService } from '../user-service.service'
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

  constructor(private userService: UserServiceService, private silk:SilkQueryService) { }

  ngOnInit() {
    this.userService.authenticated$.subscribe(result => {
      this.authed = <boolean>result
      this.authenticationNotice.emit(this.authed)
    })
  }

  onSubmit(event) {
  	this.userService.attemptLogin(this.username, this.password)
  }
}
