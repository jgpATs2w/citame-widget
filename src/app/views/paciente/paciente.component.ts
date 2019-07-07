import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {Location} from '@angular/common';
import { Subscription } from 'rxjs';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { AppService } from '../../app.service';
import {AppRouter} from '../../app.router';
import {AppState} from '../../app.state';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit, OnDestroy {

  form: FormGroup;
  id: string;

  routeSubscription: Subscription = null;
  formSubscription: Subscription = null;

  constructor(
    private appRouter: AppRouter,
    private appState: AppState,
    private fb: FormBuilder,
    private userService: UserService,
    private appService: AppService,
    private location: Location
    ) {
      this.form = this.fb.group({
         'id':  [''],
         'clinica_id':  ['1'],
         'nombre':  ['', Validators.required],
         'apellidos':  [''],
         'email':  ['', Validators.email],
         'tfno':  [''],
         'rol':  ['paciente'],
         'direccion':  [''],
         'nif':  [''],
         'envio_sms':  [false],
         'envio_email':  [false]
       });
    }

    close() {
      this.location.back();
    }
    delete() {
      if (window.confirm('Se eliminará el usuario definitivamente, incluidas sus citas y datos personales')) {
        this.userService.deleteUser(this.form.value).subscribe(r => {
          if (r.success) {
            this.appState.reset();
            this.appRouter.navigateCalendario();
          }
        });
      }
    }

    ///
    ngOnInit() {
      window.scrollTo(0, 0);
      this.userService.currentUser$
              .subscribe(paciente => {
                if (paciente) {
                  this.id = '' + paciente.id;
                  this.setupForm(paciente);
                }
              });
    }

    ngOnDestroy() {
      if (this.routeSubscription) {
        this.routeSubscription.unsubscribe();
      }
      if (this.formSubscription) {
        this.formSubscription.unsubscribe();
      }
    }

    setupForm(paciente: User) {
      this.form.patchValue(paciente);
    }

    save() {
      if (!this.form.valid) { return; }

      const paciente = this.form.value;
      if (paciente.id) {
        this.userService.updateUser(paciente).subscribe(r => {if (r.success) { this.close(); }});
      } else {
        this.userService.addUser(paciente).subscribe(r => {if (r.success) { this.close(); }});
      }
    }


}
