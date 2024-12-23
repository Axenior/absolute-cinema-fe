import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  authForm: FormGroup;
  isSubmitting: boolean = false;

  apiUrl = 'https://uas-backend-pawpaw.vercel.app/api/auth/register';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.authForm = this.fb.group({
      nama: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onAuth() {
    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const { nama, email, password } = this.authForm.value;

    this.http.post(this.apiUrl, { nama, email, password }).subscribe({
      next: (response: any) => {
        console.log('Registrasi berhasil:', response);
        alert('Registrasi Berhasil');

        this.router.navigate(['/login']);
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Registrasi gagal:', error);
        alert('Registrasi gagal.' + error.error.message);
        this.isSubmitting = false;
      },
    });
  }
}
