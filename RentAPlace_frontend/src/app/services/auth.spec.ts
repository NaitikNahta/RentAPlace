import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false for isLoggedIn when no token', () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it('should return true for isLoggedIn after saveSession', () => {
    service.saveSession({ token: 'test-token', id: '2', name: 'Naitik', role: 'Owner' });
    expect(service.isLoggedIn()).toBe(true);
  });

  it('should return correct role after saveSession', () => {
    service.saveSession({ token: 'test-token', id: '2', name: 'Naitik', role: 'Owner' });
    expect(service.getUserRole()).toBe('Owner');
  });

  it('should return correct name after saveSession', () => {
    service.saveSession({ token: 'test-token', id: '2', name: 'Naitik', role: 'Owner' });
    expect(service.getUserName()).toBe('Naitik');
  });

  it('should clear session on logout', () => {
    service.saveSession({ token: 'test-token', id: '2', name: 'Naitik', role: 'Owner' });
    service.logout();
    expect(service.isLoggedIn()).toBe(false);
    expect(service.getUserRole()).toBeNull();
  });

  it('should return token after saveSession', () => {
    service.saveSession({ token: 'abc123', id: '2', name: 'Naitik', role: 'Owner' });
    expect(service.getToken()).toBe('abc123');
  });

  it('should return correct userId after saveSession', () => {
    service.saveSession({ token: 'test-token', id: 2, name: 'Naitik', role: 'Owner' });
    expect(service.getUserId()).toBe(2);
  });
});