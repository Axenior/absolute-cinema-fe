import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-category',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css',
})
export class CategoryComponent implements OnInit {
  category: any[] = [];
  user: any = null;
  isCategoryLoading = true;
  isUserLoading = true;

  apiCategoryUrl = 'https://uas-backend-pawpaw.vercel.app/api/category';
  apiUserUrl = 'https://uas-backend-pawpaw.vercel.app/api/auth/logged';

  categoryForm: FormGroup;
  isSubmitting = false;

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);

  constructor() {
    this.categoryForm = this.fb.group({
      nama: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getLoggedUser();
    this.getCategory();
  }

  getCategory(): void {
    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get<any[]>(this.apiCategoryUrl, { headers }).subscribe({
      next: (data) => {
        this.category = data;
        console.log('Data Category:', this.category);
        this.isCategoryLoading = false;
      },
      error: (err) => {
        console.error('Error fetching Category data:', err);
        this.isCategoryLoading = false;
      },
    });
  }

  addCategory(): void {
    if (this.categoryForm.valid) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .post(this.apiCategoryUrl, this.categoryForm.value, { headers })
        .subscribe({
          next: (response) => {
            console.log('Data berhasil ditambahkan:', response);
            this.getCategory();
            this.categoryForm.reset();
            this.isSubmitting = false;

            const modalElement = document.getElementById(
              'tambahCategoryModal'
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
            console.error('Error menambahkan category:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  editCategoryId: string | null = null;

  getCategoryById(categoryId: string): void {
    this.editCategoryId = categoryId;

    const token = localStorage.getItem('authToken');
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .get(`${this.apiCategoryUrl}/${categoryId}`, { headers })
      .subscribe({
        next: (data: any) => {
          this.categoryForm.patchValue({
            nama: data.nama,
          });

          const modalElement = document.getElementById(
            'editCategoryModal'
          ) as HTMLElement;
          if (modalElement) {
            const modalInstance =
              bootstrap.Modal.getInstance(modalElement) ||
              new bootstrap.Modal(modalElement);
            modalInstance.show();
          }
        },
        error: (err) => {
          console.error('Error fetching Category data by ID:', err);
        },
      });
  }

  updateCategory(): void {
    if (this.categoryForm.valid) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .put(
          `${this.apiCategoryUrl}/${this.editCategoryId}`,
          this.categoryForm.value,
          { headers }
        )
        .subscribe({
          next: (response) => {
            console.log('Category berhasil diperbarui:', response);
            this.getCategory();
            this.categoryForm.reset();
            this.isSubmitting = false;

            const modalElement = document.getElementById(
              'editCategoryModal'
            ) as HTMLElement;
            if (modalElement) {
              const modalInstance = bootstrap.Modal.getInstance(modalElement);
              modalInstance?.hide();
            }
          },
          error: (err) => {
            console.error('Error updating category:', err);
            this.isSubmitting = false;
          },
        });
    }
  }

  deleteCategory(categoryId: string): void {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}` };

      this.http
        .delete(`${this.apiCategoryUrl}/${categoryId}`, { headers })
        .subscribe({
          next: () => {
            console.log(`Fakultas dengan ID ${categoryId} berhasil dihapus`);
            this.getCategory();
          },
          error: (err) => {
            console.error('Error menghapus Fakultas:', err);
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
