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
import { Router } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    CommonModule,
    NgxPaginationModule,
    ReactiveFormsModule,
  ],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent implements OnInit {
  movie: any[] = [];
  category: any[] = [];
  user: any = null;
  isUserLoading = true;
  isLoading = true;
  currentPage = 1;
  itemsPerPage = 6;

  apiUserUrl = 'https://uas-backend-pawpaw.vercel.app/api/auth/logged';
  apiMovieUrl = 'https://uas-backend-pawpaw.vercel.app/api/movie';
  apiCategoryUrl = 'https://uas-backend-pawpaw.vercel.app/api/category';

  movieForm: FormGroup;
  isSubmitting = false;

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor(private router: Router) {
    this.movieForm = this.fb.group({
      nama: ['', [Validators.required]],
      deskripsi: ['', [Validators.required]],
      rating: ['', [Validators.required]],
      genre: ['', [Validators.required]],
      poster: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getLoggedUser();
    this.getMovie();
    this.getCategory();
  }

  getCategory(): void {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>(this.apiCategoryUrl, { headers }).subscribe({
      next: (data) => {
        this.category = data;
        console.log('Data category:', this.category);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching category data:', err);
        this.isLoading = false;
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
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching movie data:', err);
        this.isLoading = false;
      },
    });
  }

  addMovie(): void {
    if (this.movieForm.valid) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      const formData = new FormData();
      formData.append('nama', this.movieForm.get('nama')?.value);
      formData.append('deskripsi', this.movieForm.get('deskripsi')?.value);
      formData.append('rating', this.movieForm.get('rating')?.value);
      formData.append('genre', this.movieForm.get('genre')?.value);
      formData.append('poster', this.movieForm.get('poster')?.value);

      this.http.post(this.apiMovieUrl, formData, { headers }).subscribe({
        next: () => {
          console.log('Movie berhasil ditambahkan');
          this.getMovie();
          this.movieForm.reset();
          this.isSubmitting = false;

          const modalElement = document.getElementById('tambahMovieModal');
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

  goToDetail(movieId: string): void {
    this.router.navigate([`/movie/${movieId}`]);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.movieForm.patchValue({
      poster: file,
    });
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
