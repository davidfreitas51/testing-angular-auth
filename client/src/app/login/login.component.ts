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
          console.log('Login successful', response);
        },
        error => {
          console.error('Login failed', error);
        }
      );
    } else {
      console.warn('Email and password are required');
    }
  }
}
