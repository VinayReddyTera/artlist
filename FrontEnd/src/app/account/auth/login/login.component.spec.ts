import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { ApiService } from 'src/app/pages/services/api.service';
import { EncryptionService } from 'src/app/pages/services/encryption.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;
  let encryptionService: jasmine.SpyObj<EncryptionService>;

  beforeEach(waitForAsync(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['initiateLoading', 'login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const encryptionServiceSpy = jasmine.createSpyObj('EncryptionService', ['enCrypt']);

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: EncryptionService, useValue: encryptionServiceSpy },
      ],
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    encryptionService = TestBed.inject(EncryptionService) as jasmine.SpyObj<EncryptionService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.controls['email']).toBeDefined();
    expect(component.loginForm.controls['password']).toBeDefined();
    expect(component.loginForm.controls['role']).toBeDefined();
  });

  it('should toggle password visibility', () => {
    const passwordInput = document.createElement('input');
    passwordInput.id = 'password';
    document.body.appendChild(passwordInput);

    component.showPassword = false;
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    expect(passwordInput.type).toBe('text');

    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
    expect(passwordInput.type).toBe('password');

    document.body.removeChild(passwordInput);
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue('invalid-email');
    expect(emailControl.errors).toEqual({ emailError: { message: 'Invalid email format!' } });

    emailControl.setValue('test@example.com');
    expect(emailControl.errors).toBeNull();
  });

  it('should mark form as submitted and validate fields on login', () => {
    component.loginForm.controls['email'].setValue('');
    component.loginForm.controls['password'].setValue('');
    component.loginForm.controls['role'].setValue('');
    component.login();

    expect(component.submitted).toBeTrue();
    expect(component.loginForm.controls['email'].dirty).toBeTrue();
    expect(component.loginForm.controls['password'].dirty).toBeTrue();
    expect(component.loginForm.controls['role'].dirty).toBeTrue();
  });

  it('should call ApiService.login and navigate on successful login', () => {
    const mockResponse = {
      status: 200,
      data: { name: 'Test User', email: 'test@example.com', phoneNo: '1234567890', _id: '1', role: 'user' },
      token: 'mock-token',
    };
    apiService.login.and.returnValue(of(mockResponse));
    encryptionService.enCrypt.and.callFake((data) => data);

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    component.loginForm.controls['role'].setValue('user');
    component.login();

    expect(apiService.initiateLoading).toHaveBeenCalledWith(true);
    expect(apiService.login).toHaveBeenCalledWith(component.loginForm.value);
    expect(encryptionService.enCrypt).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/artist-dashboard');
  });

  it('should handle login error response', () => {
    const mockErrorResponse = { status: 204, data: 'Invalid credentials' };
    apiService.login.and.returnValue(of(mockErrorResponse));

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    component.loginForm.controls['role'].setValue('user');
    component.login();

    expect(component.errorMessage).toBe('Invalid credentials');
  });

  it('should handle login API failure', () => {
    const mockError = { error: 'Server error' };
    apiService.login.and.returnValue(throwError(mockError));

    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    component.loginForm.controls['role'].setValue('user');
    component.login();

    expect(component.errorMessage).toBe('Server error');
  });

  it('should reset errorMessage after 5 seconds', (done) => {
    component.errorMessage = 'Some error';
    component.loginForm.controls['email'].setValue('test@example.com');
    component.loginForm.controls['password'].setValue('password');
    component.loginForm.controls['role'].setValue('user');
    component.login();

    setTimeout(() => {
      expect(component.errorMessage).toBeNull();
      done();
    }, 5000);
  });
});
