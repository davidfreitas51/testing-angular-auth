import { Component, OnInit } from '@angular/core';
import { LoginService } from './loginservice.service';
import { ILoginModel } from '../models/LoginModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  message: string = '';
  messageType: 'success' | 'error' | 'warning' = 'success'; // to differentiate between message types

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  onPost() {
    if (this.email && this.password) {
      const loginModel: ILoginModel = {
        Username: this.email,
        Password: this.password
      };
      this.loginService.login(loginModel).subscribe(
        response => {
          this.message = 'Login successful';
          this.messageType = 'success';
        },
        error => {
          this.message = 'Login failed';
          this.messageType = 'error';
        }
      );
    } else {
      this.message = 'Email and password are required';
      this.messageType = 'warning';
    }
  }
}
