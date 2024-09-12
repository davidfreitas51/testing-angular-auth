import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  roles: string[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.updateRoles(); // Initial roles setup

    // Listen to navigation events to update roles
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateRoles();
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  onLogout(): void {
    this.authService.logout();
    this.updateRoles(); // Update roles after logout
  }

  private updateRoles(): void {
    if (this.isAuthenticated()) {
      this.roles = this.authService.getRoles();
    } else {
      this.roles = [];
    }
  }

  hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
}
