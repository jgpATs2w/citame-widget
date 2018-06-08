
import {first, map, startWith} from 'rxjs/operators';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Location} from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { CalendarEvent } from 'calendar-utils';
import { Observable, Subscription } from 'rxjs';

import { AppService } from '../../app.service';

import { UserService } from '../../user/user.service';
import { User } from '../../user/user.model';
import { CalendarioService } from '../../calendario/calendario.service';
import { Cita } from '../../cita/cita.model';

@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss']
})
export class CitaComponent implements OnInit, OnDestroy {

  id: string;
  cita: Cita;
  times: string[];
  paciente_id: string= null;

  currentUser: User;
  autor: User;
  eliminador: User;
  modificador: User;
  deleted: boolean= false;

  routeSubscription: Subscription=null;
  formSubscription: Subscription=null;
  timeEndSubscription: Subscription=null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private calendarioService: CalendarioService,
    private userService: UserService,
    private location: Location
    ) {

      this.times= calendarioService.times;
    }

    ngOnInit() {
      window.scrollTo(0,0);
      this.routeSubscription= this.route.params.pipe(first()).subscribe(params=>{
        if(params.id){
          this.id= params.id;
          this.appService
                .apiGet(`/citas/${this.id}.json`)
                .subscribe(r=>{
                  if(r.success){
                    this.cita= r.data;
                  }else
                    this.appService.snack(r.message);
                })
        }else
          this.router.navigate(['/calendario'], {queryParamsHandling:'preserve'});

      });
      this.userService.currentUser$.pipe(first()).subscribe(u=>this.currentUser=u);
    }

    ngOnDestroy(){
      if(this.routeSubscription)
        this.routeSubscription.unsubscribe();
      if(this.formSubscription)
        this.formSubscription.unsubscribe();
      if(this.timeEndSubscription)
        this.timeEndSubscription.unsubscribe();
    }

    close(){
      this.location.back();
    }
    delete(){
      this.calendarioService.deleteCita(this.cita).subscribe(r=>{
        if(r.success){
          this.deleted= true;
        }
      });

    }
    undo(){
      this.cita.eliminador_id=null;
      this.cita.eliminada=null;
      this.calendarioService
            .updateCita(this.cita).subscribe(r=>{
              if(r.success){
                this.calendarioService.actions.addCita(r.data);
                this.deleted= false;
              }else
                this.appService.snack(r.message);
            });
    }

    ///

}
