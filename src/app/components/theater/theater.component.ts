import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-theater',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './theater.component.html',
  styleUrl: './theater.component.css',
})
export class TheaterComponent implements OnInit {
  theater: any[] = [];
  user: any = null;
  isUserLoading = true;
  isTheaterLoading = true;

  apiUserUrl = 'https://uas-backend-pawpaw.vercel.app/api/auth/logged';
  apiTheaterUrl = 'https://uas-backend-pawpaw.vercel.app/api/theater';

  theaterForm: FormGroup;
  isSubmitting = false;
  editTheaterId: string | null = null;

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor(private router: Router) {
    this.theaterForm = this.fb.group({
      nama: ['', [Validators.required]],
      noTelepon: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getLoggedUser();
    this.getTheater();
  }

  getTheater(): void {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>(this.apiTheaterUrl, { headers }).subscribe({
      next: (data) => {
        this.theater = data;
        console.log('Data Theater:', this.theater);
        this.isTheaterLoading = false;
      },
      error: (err) => {
        console.error('Error fetching Theater data:', err);
        this.isTheaterLoading = false;
      },
    });
  }

  addTheater(): void {
    if (this.theaterForm.valid) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .post(this.apiTheaterUrl, this.theaterForm.value, { headers })
        .subscribe({
          next: () => {
            console.log('Theater berhasil ditambahkan');
            this.getTheater();
            this.theaterForm.reset();
            this.isSubmitting = false;

            const modalElement = document.getElementById('tambahTheaterModal');
            if (modalElement) {
              const modalInstance =
                bootstrap.Modal.getInstance(modalElement) ||
                new bootstrap.Modal(modalElement);
              modalInstance.hide();

              modalElement.addEventListener(
                'hidden.bs.modal',
                () => {
                  const backdrop = document.querySelector('.modal-backdrop');
                  if (backdrop) {
                    backdrop.remove();
                  }

                  document.body.classList.remove('modal-open');
                  document.body.style.overflow = '';
                  document.body.style.paddingRight = '';
                },
                { once: true }
              );
            }
          },
          error: (err) => {
            console.error('Error menambahkan theater:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  getTheaterById(theaterId: string): void {
    this.editTheaterId = theaterId;

    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get(`${this.apiTheaterUrl}/${theaterId}`, { headers }).subscribe({
      next: (data: any) => {
        this.theaterForm.patchValue({
          nama: data.nama,
          noTelepon: data.noTelepon,
        });

        const modalElement = document.getElementById('editTheaterModal');
        if (modalElement) {
          const modalInstance =
            bootstrap.Modal.getInstance(modalElement) ||
            new bootstrap.Modal(modalElement);
          modalInstance.show();
        }
      },
      error: (err) => {
        console.error('Error fetching theater by ID:', err);
      },
    });
  }

  updateTheater(): void {
    if (this.theaterForm.valid && this.editTheaterId) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .put(
          `${this.apiTheaterUrl}/${this.editTheaterId}`,
          this.theaterForm.value,
          { headers }
        )
        .subscribe({
          next: () => {
            console.log('Theater berhasil diperbarui');
            this.getTheater();
            this.theaterForm.reset();
            this.isSubmitting = false;

            const modalElement = document.getElementById(
              'editTheaterModal'
            ) as HTMLElement;
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
          },
          error: (err) => {
            console.error('Error updating theater:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  deleteTheater(theaterId: string): void {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .delete(`${this.apiTheaterUrl}/${theaterId}`, { headers })
        .subscribe({
          next: () => {
            console.log('Theater berhasil dihapus');
            this.getTheater();
          },
          error: (err) => {
            console.error('Error menghapus theater:', err);
          },
        });
    }
  }

  goToDetail(theaterId: string): void {
    this.router.navigate([`/theater/${theaterId}`]);
  }

  getLoggedUser() {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(this.apiUserUrl, { headers }).subscribe({
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
}
