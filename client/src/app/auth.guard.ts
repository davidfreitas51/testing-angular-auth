import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const expectedRoles = next.data.roles as Array<string>;
    const userRoles = this.authService.getRoles();

    if (this.authService.isAuthenticated() && this.hasRequiredRole(userRoles, expectedRoles)) {
      return true;
    }

    // Redirect to login or unauthorized page if not authorized
    this.router.navigate(['/login']);
    return false;
  }

  private hasRequiredRole(userRoles: string[], expectedRoles: string[]): boolean {
    return expectedRoles.some(role => userRoles.includes(role));
  }
}
