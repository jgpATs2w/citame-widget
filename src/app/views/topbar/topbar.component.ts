import { Component, OnInit, Inject  } from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
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
    private userService: UserService,
    public dialog: MatDialog
  ) {
    this.user$= this.userService.currentUser$;
  }

  ngOnInit() {}

  logout(){

    let dialogRef = this.dialog.open(LogoutDialog, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(ok => {
      if(ok){
        this.userService
            .logout()
            .subscribe(()=>{
              this.router.navigate(['/login']);
              this.userService.actions.setCurrentUser(null);
            });
      }
    });
  }
  clinicaChanged(clinica_id:string){
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { clinica_id: clinica_id }, queryParamsHandling: 'merge', preserveFragment: true });
  }
}

@Component({
  selector: 'app-logout-dialog',
  templateUrl: 'logout-dialog.html',
})
export class LogoutDialog {

  constructor(
    public dialogRef: MatDialogRef<LogoutDialog>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
