import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Login],
      imports: [
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty email and password on init', () => {
    expect(component.email).toBe('');
    expect(component.password).toBe('');
  });

  it('should have no error message on init', () => {
    expect(component.errorMsg).toBe('');
  });

  it('should have showPassword as false on init', () => {
    expect(component.showPassword).toBe(false);
  });

  it('should set errorMsg if fields are empty', () => {
    component.email = '';
    component.password = '';
    component.onLogin();
    expect(component.errorMsg).toBe('Please fill in all fields');
  });

  it('should toggle showPassword', () => {
    expect(component.showPassword).toBe(false);
    component.showPassword = !component.showPassword;
    expect(component.showPassword).toBe(true);
  });
});