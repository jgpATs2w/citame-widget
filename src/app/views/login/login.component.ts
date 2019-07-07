import { Component, OnInit, NgZone } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {Location} from '@angular/common';

import { AppService } from '../../app.service';
import {
  UserService,
  emailPattern, phonePattern, passwordPattern } from '../../user/user.service';

import { User } from '../../user/user.model';
import { ApiResponse } from '../../api/apiresponse.model';
import {AppRouter} from '../../app.router';
import {AppState} from '../../app.state';


function idValidator(control: FormControl): { [s: string]: boolean } {
  if (!control.value.match(emailPattern) && ! control.value.match(phonePattern) ) {
    return {invalidId: true};
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  message: string;
  state = 0;
  sending = false;
  disableLogin = false;

  constructor(
    private appRouter: AppRouter,
    private appState: AppState,
    private location: Location,
    private zone: NgZone,
    private fb: FormBuilder,
    private userService: UserService,
    private appService: AppService) {
    this.loginForm = fb.group({
      'id':  ['', Validators.compose([Validators.required, idValidator ])],
      'password':  ['', Validators.required]
    });

    this.registerForm = fb.group({
      'email':  ['', Validators.compose([Validators.required, Validators.email])],
      'tfno':  ['', Validators.compose([Validators.required, Validators.pattern(phonePattern)])],
      'password':  ['', Validators.compose([Validators.required, Validators.pattern(passwordPattern)])],
      'nombre':  ['', Validators.required],
      'rol': ['paciente'],
      'apellidos': [''],
      'direccion': ['']
    });
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    const params = this.appRouter.getQueryParams();
      if (!!params.key) {
          this.appState.key = params.key;
      } else {
          if (!this.appState.key) {
              this.appService.snack('Falta la llave en la url. Contacte con el administrador');
              this.disableLogin = true;
          }
      }
  }

    loginFacebook() {
        this.message = 'validando...';
        this.sending = true;
        this.userService.loginFacebook()
            .subscribe(response => {
                this.parseApiResponse(response);
            }, error => this.displayError(error, true));
    }

    loginGoogle() {
        this.message = 'validando...';
        this.sending = true;
        this.userService
            .loginGoogle()
            .subscribe(response => {
                this.parseApiResponse(response);
            }, error => this.displayError(error, true));
    }

    onLoginSubmit(form) {
        this.message = 'validando...';
        this.sending = true;

        this.userService
            .loginEmail(form)
            .subscribe( (response: ApiResponse ) => {
                this.message = 'válido';
                if (response.success) {
                    this.parseApiResponse(response);
                } else {
                    this.displayError();
                }
            });
    }

    onRegisterSubmit() {
        if (this.disableLogin) {
            this.appService.snack('Falta la llave en la url. Contacte con el administrador');
            return;
        }
        this.sending = true;
        const form = this.registerForm;
        this.userService
            .createUser(form.value)
            .subscribe( (response: ApiResponse ) => {
                this.sending = false;
                if (response.success) {
                    this.parseApiResponse(response);
                } else {
                    this.displayError(response.message);
                }
            }, error => this.displayError(error, true));
    }

  remindPassword() {
    this.userService
      .sendReminder(this.loginForm.controls['id'].value)
      .subscribe( response => {
        if (response.success) {
          this.state = 0;
        } else {
          this.displayError('no existe ninguna cuenta con ese identificador');
        }
      }, error => this.displayError(error, true));
  }
/*
  private saveUserAndGo(user: User) {
    if (user) {
      this.userService.actions.setCurrentUser(user);
      if (this.route.snapshot.queryParams.from) {
        const from = this.route.snapshot.queryParams.from;
        const queryParams = this.route.snapshot.queryParams;

        this.router.navigate([from], {queryParams: {...queryParams, from: undefined}});
      } else {
        this.router.navigate(['calendario'], {queryParamsHandling: 'preserve', preserveFragment: true});
      }
    } else {
      this.setupRegisterForm(this.userService.userFromFirebase);
      this.sending = false;
      this.state = 2;
    }
  }*/
    private parseApiResponse(response: ApiResponse) {
        const user = response.data;
        this.appState.authToken = response.authToken;

        if (user) {
            if (user.key) {
                this.end(user);
                return;
            } else if (user.keys) {
                this.zone.run(() => { this.state = 2; this.sending = false; });
                this.state = 2;
                this.sending = false;
                return;
            }
        }

        this.state = 0;
        this.message = 'no autorizado';
        // this.zone.run(() => { this.state = 0; this.sending = false; this.message = 'no autorizado'; });
        this.sending = false;
    }
    private end(user: User){
        this.appState.user = user;
        this.appState.key = user.key;
        this.sending = false;
        this.zone.run(() => { this.appRouter.navigateCalendario(); });
    }
  private displayError(message= 'no autorizado', snack= false) {
    this.state = 0; this.sending = false;
    if (snack) {
      this.appService.snack(message);
    } else {
      this.message = message;
    }
    this.zone.run(() => { this.state = 0; this.sending = false;
      if (snack) {
        this.appService.snack(message);
      } else {
        this.message = message;
      }
      }
    );
  }

}
