import { Component, OnInit, HostBinding, Inject, NgZone } from '@angular/core';
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
import { Observable } from "rxjs/Rx";

import { environment } from '../../../environments/environment';
/*
import { AppService } from '../../app.service';
import {
  UserService,
  emailPattern, phonePattern, passwordPattern } from '../../user/user.service';

import { User } from '../../user/user.model';
import { ApiResponse } from '../../api/apiresponse.model';


function idValidator(control: FormControl): { [s: string]: boolean } {
  if (!control.value.match(emailPattern) && ! control.value.match(phonePattern) ) {
    return {invalidId: true};
  }
}*/

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  state: number=0;
  ngOnInit(){}
/*
  loginForm: FormGroup;
  registerForm: FormGroup;
  error: any;
  state: number=0;

  constructor(
    private router: Router, private route: ActivatedRoute,
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
      'nombre':  ['', Validators.required]
    });
  }

  ngOnInit() {}

  loginFacebook() {
    this.userService.loginFacebook()
    .subscribe((user: User)=>{
      this.saveUserAndGo(user);
    }, console.error);
  }

  loginGoogle() {
    this.userService
      .loginGoogle()
      .subscribe((user: User)=>this.saveUserAndGo(user), console.error);
  }

  onLoginSubmit(form){
    this.userService
      .loginEmail(form)
      .subscribe( (response: ApiResponse )=>{
        if(response.success){
          this.userService.actions.setCurrentUser(response.data);
          this.router.navigate(['/calendario']);
        }else{
          this.appService.snack("Acceso no autorizado");
        }
      });
  }

  remindPassword(){
    this.userService
      .sendReminder(this.loginForm.controls['id'].value)
      .subscribe( response =>{
        if(response.success){
          this.state=0;
        }else{
          this.appService.snack("no existe ninguna cuenta con ese identificador");
        }
      });
  }

  private saveUserAndGo(user: User){
    if(user && user.rol != "paciente"){
      this.userService.actions.setCurrentUser(user);
      this.zone.run(() => { this.router.navigate(['/protected']) });
      this.router.navigate(['/calendario']);
    }else{
      this.appService.snack("el usuario no dispone de permisos para entrar en la aplicación");
    }

  }
*/
}
