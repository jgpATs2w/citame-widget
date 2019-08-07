import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';

const extra: any = {queryParamsHandling: 'merge'};
@Injectable()
export class AppRouter {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  public navigateLogin() {
    this.router.navigate(['/login'], extra  );
  }

  public navigateCalendario() {
    this.router.navigate(['/calendario'], extra );
  }
  public navigatePaciente(){
    this.router.navigate(['/paciente'], extra );
  }
  public navigate( path: string ){
    this.router.navigate([ path ], extra );
  }

  public getQueryParams(): Params {
    return this.route.snapshot.queryParams;
  }
  public getParams(): Params {
    return this.route.snapshot.params;
  }
  public navigateBack() {
    this.location.back();
  }
  public isPageRefresh(): boolean {
    return( ! this.router.navigated );
  }
  get routePath(): string {
    return this.location.path(false);
  }
}
