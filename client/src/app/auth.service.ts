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

  getRoles(): string[] {
    const token = this.getAuthToken();
    if (!token) {
      return [];
    }
    try {
      // Decode the token manually
      const payload = this.decodeJwtToken(token);
      return payload.role || [];
    } catch (error) {
      console.error('Error decoding token:', error);
      return [];
    }
  }

  private decodeJwtToken(token: string): any {
    // Split the token into its parts
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token');
    }

    // Base64Url decode the payload part (second part)
    const payload = parts[1];
    const decodedPayload = this.base64UrlDecode(payload);
    return JSON.parse(decodedPayload);
  }

  private base64UrlDecode(base64Url: string): string {
    // Replace URL-safe characters
    let base64 = base64Url
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if necessary
    const padding = base64.length % 4;
    if (padding > 0) {
      base64 += '='.repeat(4 - padding);
    }

    // Decode base64
    const decoded = atob(base64);
    return decoded;
  }
}
