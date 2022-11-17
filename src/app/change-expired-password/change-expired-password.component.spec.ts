import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeExpiredPasswordComponent } from './change-expired-password.component';

describe('ChangeExpiredPasswordComponent', () => {
  let component: ChangeExpiredPasswordComponent;
  let fixture: ComponentFixture<ChangeExpiredPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeExpiredPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeExpiredPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
