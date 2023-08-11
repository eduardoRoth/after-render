import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointGameComponent } from './point-game.component';

describe('PointGameComponent', () => {
  let component: PointGameComponent;
  let fixture: ComponentFixture<PointGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PointGameComponent]
    });
    fixture = TestBed.createComponent(PointGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
