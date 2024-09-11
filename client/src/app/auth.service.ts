import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service'; // Use ngx-cookie-service for handling cookies

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'https://localhost:7160/api/user/login'; // Your API login endpoint

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  login(email: string, password: string): Observable<any> {
    const body = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.http.post(this.loginUrl, body, {
      headers,
      withCredentials: true, // Ensure cookies are sent and received
      observe: 'response' as 'response'
    });
  }

  isAuthenticated(): boolean {
    return this.cookieService.check('AuthToken');
  }

  logout(): void {
    this.cookieService.delete('AuthToken');
  }

  getAuthToken(): string | null {
    return this.cookieService.get('AuthToken');
  }
}
