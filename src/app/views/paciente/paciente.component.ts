import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {Location} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarEvent } from 'calendar-utils';
import { Observable, Subscription } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/first';
import {FormControl} from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./paciente.component.scss']
})
export class PacienteComponent implements OnInit {

  form: FormGroup;
  titulo: string;
  dateFC: FormControl= new FormControl(new Date());
  times: string[];
  id: string;

  routeSubscription: Subscription=null;
  formSubscription: Subscription=null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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
         'envio_sms':  [false, Validators.required],
         'envio_email':  [false, Validators.required]
       });

    }

    close(){
      this.location.back();
    }
    delete(){
      this.userService.actions.deleteUsuario(this.form.get('id').value);
      this.appService.snack("Se ha eliminado el paciente", "deshacer").subscribe(()=>console.info("deshacer"));
      this.close();
    }

    ///
    ngOnInit() {
      //TODO if pacientes is not loaded, read usuario from api
      const findPaciente$= (id)=>this.userService.pacientes$.map(pacientes=>pacientes.find(p=>p.id==id));
      this.routeSubscription= this.route
                                  .params
                                  .pluck('id')
                                  .do((id:string)=>this.id=id)
                                  .filter(id=>id!=null)
                                  .switchMap(id=>findPaciente$(id))
                                  .first()
                                  .subscribe(paciente=>{
                                    if(paciente)
                                      this.setupForm(paciente);
                                    else
                                      this.appService.snack("no se ha encontrado ningún paciente")
                                  });
    }

    ngOnDestroy(){
      if(this.routeSubscription)
        this.routeSubscription.unsubscribe();
      if(this.formSubscription)
        this.formSubscription.unsubscribe();
    }

    setupForm(paciente: User){
      this.form.patchValue(paciente);

       if(this.formSubscription==null){
         this.userService.actions.setCurrentPaciente(paciente);
         this.formSubscription= this.form.valueChanges.debounceTime(1000).subscribe(
             (form: any) => {
               this.userService.actions.updateUsuario(form);
             }
           )
       }
    }

    save(){
      if(!this.form.valid) return;

      this.userService.actions.addUser(this.form.getRawValue());
      this.close();
    }


}
