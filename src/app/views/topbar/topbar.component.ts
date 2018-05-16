import { Component, OnInit, Inject  } from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { Observable } from "rxjs/Rx";

import { User } from '../../user/user.model';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  user$: Observable<User>;
  clinica: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {
    this.user$= this.userService.currentUser$;
  }

  ngOnInit() {}

  logout(){
    this.userService
        .logout()
        .subscribe(()=>{
          this.router.navigate(['/calendario'], {queryParamsHandling:'preserve'});
          this.userService.actions.setCurrentUser(null);
        });
  }
  clinicaChanged(clinica_id:string){
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { clinica_id: clinica_id }, queryParamsHandling: 'merge', preserveFragment: true });
  }
}
