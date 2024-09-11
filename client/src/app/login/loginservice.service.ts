import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ILoginModel } from '../models/LoginModel';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl: string = "https://localhost:7160/api/user/";

  constructor(private http: HttpClient) { }

  login(loginModel: ILoginModel): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}login`, loginModel);
  }  
}
