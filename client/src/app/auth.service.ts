import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

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
      withCredentials: true,
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

  getRoles(): string[] {
    const token = this.getAuthToken();
    if (!token) {
      return [];
    }
    try {
      const decodedToken = this.decodeToken(token);
      return decodedToken.role || [];
    } catch (error) {
      console.error('Error decoding token:', error);
      return [];
    }
  }

  private decodeToken(token: string): any {
    // Decode JWT token manually
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }
}
