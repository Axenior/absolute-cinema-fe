import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  authForm: FormGroup;
  isSubmitting: boolean = false;

  apiUrl = 'https://uas-backend-pawpaw.vercel.app/api/auth/login';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  onAuth() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const { email, password } = this.authForm.value;

    this.http.post(this.apiUrl, { email, password }).subscribe({
      next: (response: any) => {
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          console.log('Login berhasil:', response);

          this.router.navigate(['/']).then(() => {
            window.location.reload();
          });
        } else {
          console.error('Token tidak ditemukan dalam response:', response);
          alert('Login gagal. Tidak ada token.');
        }
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Login gagal:', error);
        alert('Login gagal. Periksa email atau password.');
        this.isSubmitting = false;
      },
    });
  }
}
