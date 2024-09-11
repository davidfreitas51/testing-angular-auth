import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILoginModel } from '../models/LoginModel';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private SIGNIN_USER_URL = 'https://localhost:7160/api/user/';

  constructor(private http: HttpClient) { }

  public login(loginModel: ILoginModel) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true,
      observe: 'response' as 'response'
    };

    return this.http.post<HttpResponse<any>>(this.SIGNIN_USER_URL + "login", loginModel, httpOptions);
  }
}
