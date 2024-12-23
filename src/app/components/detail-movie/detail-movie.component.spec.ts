import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMovieComponent } from './detail-movie.component';

describe('DetailMovieComponent', () => {
  let component: DetailMovieComponent;
  let fixture: ComponentFixture<DetailMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
