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
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  error: string;
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
      'nombre':  ['', Validators.required],
      'rol': ['paciente'],
      'apellidos': [''],
      'direccion': ['']
    });
  }

  ngOnInit() {
    this.appService.readQuery();
  }

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
          this.saveUserAndGo(response.data);
        }else{
          this.error= "Acceso no autorizado";
        }
      });
  }

  onRegisterSubmit(form){
    this.userService
      .createUser(form)
      .subscribe( (response: ApiResponse )=>{
        if(response.success){
          this.saveUserAndGo(response.data);
        }else{
          this.error= response.message;
        }
      });
  }

  setupRegisterForm(user: User){
    this.registerForm.patchValue(user);
  }

  remindPassword(){
    this.userService
      .sendReminder(this.loginForm.controls['id'].value)
      .subscribe( response =>{
        if(response.success){
          this.state=0;
        }else{
          this.error= "no existe ninguna cuenta con ese identificador";
        }
      });
  }

  private saveUserAndGo(user: User){
    if(user){
      this.userService.actions.setCurrentUser(user);
      this.router.navigate(['/calendario'], {queryParamsHandling:'merge'});
    }else{
      this.setupRegisterForm(this.userService.userFromFirebase);
      this.state= 2;
    }
  }

}
