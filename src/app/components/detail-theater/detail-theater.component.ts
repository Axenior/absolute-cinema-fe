import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-detail-theater',
  imports: [
    MatButtonModule,
    MatCardModule,
    CommonModule,
    NgxPaginationModule,
    ReactiveFormsModule,
  ],
  templateUrl: './detail-theater.component.html',
  styleUrl: './detail-theater.component.css',
})
export class DetailTheaterComponent implements OnInit {
  theaterId: string | null = null;
  theater: any = null;
  movie: any[] = [];
  user: any = null;
  isUserLoading = true;
  isTheaterLoading = true;
  isMovieLoading = true;
  currentPage = 1;
  itemsPerPage = 6;

  apiTheaterUrl = 'https://uas-backend-pawpaw.vercel.app/api/theater';
  apiMovieUrl = 'https://uas-backend-pawpaw.vercel.app/api/movie';
  apiUserUrl = 'https://uas-backend-pawpaw.vercel.app/api/auth/logged';

  theaterForm: FormGroup;
  isSubmitting = false;

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor(private route: ActivatedRoute, private router: Router) {
    this.theaterForm = this.fb.group({
      movieId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getLoggedUser();
    this.getTheaterId();
    this.getTheaterById(this.theaterId);
    this.getMovie();
  }

  getTheaterId(): void {
    this.theaterId = this.route.snapshot.paramMap.get('id');
    console.log('theater ID:', this.theaterId);
  }

  getTheaterById(theaterId: string | null): void {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .get<any[]>(`${this.apiTheaterUrl}/${this.theaterId}`, { headers })
      .subscribe({
        next: (data) => {
          this.theater = data;
          console.log('Data this.theater:', this.theater);
          this.isTheaterLoading = false;
        },
        error: (err) => {
          console.error('Error fetching theater data:', err);
          this.isTheaterLoading = false;
        },
      });
  }

  getMovie(): void {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>(this.apiMovieUrl, { headers }).subscribe({
      next: (data) => {
        this.movie = data;
        console.log('Data movie:', this.movie);
        this.isMovieLoading = false;
      },
      error: (err) => {
        console.error('Error fetching movie data:', err);
        this.isMovieLoading = false;
      },
    });
  }

  addMovie(): void {
    if (this.theaterForm.valid) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .post(
          `${this.apiTheaterUrl}/add/${this.theaterId}`,
          this.theaterForm.value,
          { headers }
        )
        .subscribe({
          next: (response) => {
            console.log('Data berhasil ditambahkan:', response);
            this.getTheaterById(this.theaterId);
            this.theaterForm.reset();
            this.isSubmitting = false;

            const modalElement = document.getElementById(
              'tambahMovieModal'
            ) as HTMLElement;

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
            console.error('Error menambahkan movie:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  deleteMovie(): void {
    if (this.theaterForm.valid) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .delete(`${this.apiTheaterUrl}/delete/${this.theaterId}`, {
          headers,
          body: this.theaterForm.value,
        })
        .subscribe({
          next: (response) => {
            console.log('Data berhasil ditambahkan:', response);
            this.getTheaterById(this.theaterId);
            this.theaterForm.reset();
            this.isSubmitting = false;

            const modalElement = document.getElementById(
              'hapusMovieModal'
            ) as HTMLElement;

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
            console.error('Error menghapus movie:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  goToDetail(movieId: string): void {
    this.router.navigate([`/movie/${movieId}`]);
  }

  isMovieInTheater(movieId: string): boolean {
    return this.theater.movies.some(
      (movie: { _id: string }) => movie._id === movieId
    );
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
