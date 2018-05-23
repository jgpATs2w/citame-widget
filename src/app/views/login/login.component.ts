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
import {Location} from '@angular/common';
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
  message: string;
  state: number=0;
  sending: boolean= false;

  constructor(
    private router: Router, private route: ActivatedRoute,
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
    window.scrollTo(0,0);
  }

  loginFacebook() {
    this.message= "validando...";
    this.sending= true;
    this.userService.loginFacebook()
    .subscribe((user: User)=>{
      this.saveUserAndGo(user);
    }, error=>this.displayError(error, true));
  }

  loginGoogle() {
    this.message= "validando...";
    this.sending= true;
    this.userService
      .loginGoogle()
      .subscribe((user: User)=>{
        this.saveUserAndGo(user);
      }, error=>this.displayError(error, true));
  }

  onLoginSubmit(form){
    this.message= "validando...";
    this.sending= true;
    this.userService
      .loginEmail(form)
      .subscribe( (response: ApiResponse )=>{
        if(response.success){
          this.saveUserAndGo(response.data);
        }else{
          this.displayError();
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
          this.displayError(response.message);
        }
      }, error=>this.displayError(error, true));
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
          this.displayError("no existe ninguna cuenta con ese identificador");
        }
      }, error=>this.displayError(error, true));
  }

  private saveUserAndGo(user: User){
    if(user){
      this.userService.actions.setCurrentUser(user);
      if(this.route.snapshot.queryParams.from){
        const from= this.route.snapshot.queryParams.from;
        let queryParams= this.route.snapshot.queryParams;

        this.router.navigate([from], {queryParams: {...queryParams, from: undefined}});
      }else
        this.router.navigate(['calendario'], {queryParamsHandling: 'preserve', preserveFragment: true})
    }else{
      this.setupRegisterForm(this.userService.userFromFirebase);
      this.sending= false;
      this.state= 2;
    }
  }

  private displayError(message="no autorizado", snack=false){
    this.state=0; this.sending= false;
    if(snack)
      this.appService.snack(message);
    else
      this.message= message;
    this.zone.run(() => { this.state=0; this.sending= false;
      if(snack)
        this.appService.snack(message);
      else
        this.message= message;
      }
    );
  }

}
