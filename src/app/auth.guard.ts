import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  return true;
};

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');

    if (token) {
      // Token ada, akses diizinkan
      return true;
    } else {
      // Token tidak ada, arahkan ke halaman login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
