import { async, ComponentFixture, TestBed,
  inject,
  fakeAsync, tick } from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import {Location} from "@angular/common";
import { RouterTestingModule } from '@angular/router/testing';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule
 } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { AppMaterialModule } from '../../app.material.module';
import {
  advance,
  createRoot,
  RootCmp,
  configureTests
} from '../../test/test.module';
import {
  dispatchEvent,
  ConsoleSpy
} from '../../test/utils';

import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';
import { UserActions } from '../../app.actions';
import { AppState} from '../../app.store';

import { AppService } from '../../app.service';
import { UserService } from '../../user/user.service';
import { UserServiceMock } from '../../user/user.service.mock';
import { LoginComponent } from './login.component';

class AppServiceMock{}
class CalendarioComponentMock{}

export const routerConfig: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'calendario', component: CalendarioComponentMock }
]

xdescribe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [
        AppMaterialModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(routerConfig),
        NgReduxTestingModule
      ],
      providers:[
        UserActions,
        {provide: AppService, useClass: AppServiceMock},
        {provide: UserService, useClass: UserServiceMock}
      ]
    })
    .compileComponents();

    MockNgRedux.reset();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    location = TestBed.get(Location);
    router= TestBed.get(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have login as initial route', fakeAsync(() => {
    router.initialNavigation();
    tick();
    expect(location.path()).toBe('/login');
  }));

  it('should login with facebook', fakeAsync(() => {
    component.loginFacebook();
    tick();
    expect(location.path()).toBe('/calendario');
  }));

  it('should login with google', fakeAsync(() => {
    component.loginGoogle();
    tick();
    expect(location.path()).toBe('/calendario');
  }));


  it('should login with email', fakeAsync(() => {
    const emailButton= fixture.debugElement.query(By.css('button.login-email'));
    emailButton.triggerEventHandler('click', null);

    tick();
    fixture.detectChanges();
    expect(component.state).toBe(1);

    let emailInput = fixture.debugElement.query(By.css('.login-email-input')).nativeElement;
    let passwordInput = fixture.debugElement.query(By.css('.login-password-input')).nativeElement;

    emailInput.value= "pepito@gmail.com";
    passwordInput.value= "123456789";

    dispatchEvent(emailInput, 'input');
    dispatchEvent(passwordInput, 'input');


    const loginButton= fixture.debugElement.query(By.css('.login-submit'));
    loginButton.triggerEventHandler('click', null);
    tick();
    //expect(location.path()).toBe('/calendario');
  }));

});
