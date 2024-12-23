import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common'; // Mengimpor CommonModule agar dapat menggunakan fitur-fitur dasar Angular seperti *ngIf dan *ngFor
import { RouterModule } from '@angular/router'; // Mengimpor RouterModule
import { Router } from '@angular/router'; // Mengimpor Router
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Absolute Cinema';

  isLoggedIn: boolean = false;
  user: any = null;
  isUserLoading = true;

  apiUrl = 'https://uas-backend-pawpaw.vercel.app/api/auth/logged';

  private http = inject(HttpClient);
  constructor(private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('authToken');
    if (this.isLoggedIn) {
      this.getLoggedUser();
    }
  }

  getLoggedUser() {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(this.apiUrl, { headers }).subscribe({
      next: (data) => {
        this.user = data.user;
        this.isUserLoading = false;
        console.log('Data user:', this.user);
      },
      error: (err) => {
        this.isUserLoading = false;
        console.error('Error fetching movie data:', err);
      },
    });
  }

  onLogout() {
    localStorage.removeItem('authToken');
    this.isLoggedIn = false;
    this.router.navigate(['/auth']);
  }
}
