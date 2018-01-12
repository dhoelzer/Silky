import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../user-service.service'
import { SilkQueryService } from '../silk-query.service'


@Component({
  selector: 'login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = "";
  password: string = "";
  authed: boolean = false;

  constructor(private userService: UserServiceService, private silk:SilkQueryService) { }

  ngOnInit() {
    this.silk.checkAuthenticated().subscribe(result => {
      this.authed = <boolean>result
      console.log(this.authed)
    })
  }

  onSubmit(event) {
  	console.log(this.username,this.password)
  	this.userService.attemptLogin(this.username, this.password)
  	console.log(this.userService.canActivate())
    this.silk.checkAuthenticated().subscribe(result => {
      this.authed = <boolean>result
      console.log(this.authed)
    })
  }
}
