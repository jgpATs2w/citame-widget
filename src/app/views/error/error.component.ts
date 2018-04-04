import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AppService } from '../../app.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  error: number;
  appService: AppService;

  constructor(
    private route: ActivatedRoute,
    appService: AppService
  ) {
    this.appService= appService;
    route.queryParams.first().subscribe(params=>this.error= params.error? params.error: 0);
  }

  ngOnInit() {}

}
