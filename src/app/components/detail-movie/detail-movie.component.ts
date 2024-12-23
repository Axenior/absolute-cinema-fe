import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-detail-movie',
  imports: [MatCardModule, CommonModule, ReactiveFormsModule],
  templateUrl: './detail-movie.component.html',
  styleUrl: './detail-movie.component.css',
})
export class DetailMovieComponent implements OnInit {
  movieId: string | null = null;
  userId: string | null = null;
  movie: any = null;
  review: any[] = [];
  category: any[] = [];
  user: any = null;
  isMovieLoading = true;
  isReviewLoading = true;
  isCategoryLoading = true;
  isUserLoading = true;

  apiMovieUrl = 'https://uas-backend-pawpaw.vercel.app/api/movie';
  apiCategoryUrl = 'https://uas-backend-pawpaw.vercel.app/api/category';
  apiReviewUrl = 'https://uas-backend-pawpaw.vercel.app/api/review';
  apiUserUrl = 'https://uas-backend-pawpaw.vercel.app/api/auth/logged';

  movieForm: FormGroup;
  reviewForm: FormGroup;
  isSubmitting = false;

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor(private route: ActivatedRoute, private router: Router) {
    this.movieForm = this.fb.group({
      nama: [''],
      deskripsi: [''],
      rating: [''],
      genre: [''],
      poster: [null],
    });
    this.reviewForm = this.fb.group({
      deskripsi: ['', Validators.required],
      movieId: [null],
      userId: [null],
    });
  }

  ngOnInit(): void {
    this.getLoggedUser();
    this.getMovieId();
    this.getMovieById(this.movieId);
    this.getReview(this.movieId);
    this.getCategory();
  }

  getMovieId(): void {
    this.movieId = this.route.snapshot.paramMap.get('id');
    this.reviewForm.patchValue({ movieId: this.movieId });
    console.log('Movie ID:', this.movieId);
  }

  getCategory(): void {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>(this.apiCategoryUrl, { headers }).subscribe({
      next: (data) => {
        this.category = data;
        console.log('Data category:', this.category);
        this.isCategoryLoading = false;
      },
      error: (err) => {
        console.error('Error fetching category data:', err);
        this.isCategoryLoading = false;
      },
    });
  }

  getMovieById(movieId: string | null): void {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .get<any[]>(`${this.apiMovieUrl}/${movieId}`, { headers })
      .subscribe({
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

  getReview(movieId: string | null): void {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .get<any[]>(`${this.apiReviewUrl}?movieId=${movieId}`, { headers })
      .subscribe({
        next: (data) => {
          this.review = data;
          console.log('Data review:', this.review);
          this.isReviewLoading = false;
        },
        error: (err) => {
          console.error('Error fetching review data:', err);
          this.isReviewLoading = false;
        },
      });
  }

  deleteMovie(): void {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .delete(`${this.apiMovieUrl}/${this.movieId}`, { headers })
        .subscribe({
          next: () => {
            console.log('Theater berhasil dihapus');
            this.router.navigate(['/movie']).then(() => {
              window.location.reload();
            });
          },
          error: (err) => {
            console.error('Error menghapus theater:', err);
          },
        });
    }
  }

  openEditMovieModal(): void {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };
    this.http
      .get(`${this.apiMovieUrl}/${this.movieId}`, { headers })
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.movieForm.patchValue({
            nama: data.nama,
            deskripsi: data.deskripsi,
            rating: data.rating,
            // poster: data.poster,
            genre: data.genre?._id,
          });
          console.log(this.movieForm.value);

          const modalElement = document.getElementById('editMovieModal');
          if (modalElement) {
            const modalInstance =
              bootstrap.Modal.getInstance(modalElement) ||
              new bootstrap.Modal(modalElement);
            modalInstance.show();
          }
        },
        error: (err) => {
          console.error('Error fetching Movie by ID:', err);
        },
      });
  }

  updateMovie(): void {
    if (this.movieForm.valid && this.movieId) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      const formData = new FormData();
      formData.append('nama', this.movieForm.get('nama')?.value);
      formData.append('deskripsi', this.movieForm.get('deskripsi')?.value);
      formData.append('rating', this.movieForm.get('rating')?.value);
      formData.append('genre', this.movieForm.get('genre')?.value);
      formData.append('poster', this.movieForm.get('poster')?.value);

      console.log(formData);
      this.http
        .put(`${this.apiMovieUrl}/${this.movieId}`, formData, {
          headers,
        })
        .subscribe({
          next: () => {
            console.log('Movie berhasil diperbarui');
            this.getMovieById(this.movieId);
            this.movieForm.reset();
            this.isSubmitting = false;

            const modalElement = document.getElementById(
              'editMovieModal'
            ) as HTMLElement;
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
          },
          error: (err) => {
            console.error('Error updating movie:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.movieForm.patchValue({
      poster: file,
    });
  }

  addReview(): void {
    if (this.reviewForm.valid) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .post(this.apiReviewUrl, this.reviewForm.value, { headers })
        .subscribe({
          next: () => {
            console.log('Review berhasil ditambahkan');
            this.getReview(this.movieId);
            this.reviewForm.reset();
            this.isSubmitting = false;

            const modalElement = document.getElementById('reviewModal');
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
            console.error('Error menambahkan review:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  getLoggedUser() {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any>(this.apiUserUrl, { headers }).subscribe({
      next: (data) => {
        this.user = data.user;
        this.userId = data.user._id;
        this.isUserLoading = false;

        this.reviewForm.patchValue({ userId: this.userId });
        console.log('Data user:', this.user);
      },
      error: (err) => {
        this.isUserLoading = false;
        console.error('Error fetching movie data:', err);
      },
    });
  }
}
