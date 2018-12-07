
import {of as observableOf,  Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';

import { NgRedux, DevToolsExtension } from '@angular-redux/store';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';

import { AppService } from '../app.service';
import { CalendarioService } from './calendario.service';
import {UserService} from '../user/user.service';
import {UserServiceMock} from '../user/user.service.mock';

import { CalendarioActions } from './calendario.actions';
class AppServiceMock{
  apiGet( url ){
    return observableOf({
      success: true,
      data: []
    })
  }
  apiPost( url, body ){
    return observableOf({
      success: true,
      data: null
    })
  }
}

describe('CalendarioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ NgReduxTestingModule],
      providers: [
        CalendarioService,
        {provide: AppService, useClass: AppServiceMock},
        CalendarioActions,
        {provide: UserService, useClass: UserServiceMock},
      ]
    });
  });

  it('should be created', inject([CalendarioService], (service: CalendarioService) => {
    expect(service).toBeTruthy();
  }));
  it('should format dates', inject([CalendarioService], (calendarioService: CalendarioService) => {
    let formatedDate= calendarioService.formatDate(new Date('2018-03-15'), 'month', 'next');

    expect(formatedDate).toEqual("2018-04");

    formatedDate= calendarioService.formatDate(new Date('2018-03-15'), 'day', 'next');

    expect(formatedDate).toEqual("2018-03-16");


    formatedDate= calendarioService.formatDate(new Date('2018-12-31'), 'day', 'next');

    expect(formatedDate).toEqual("2019-01-01");

    formatedDate= calendarioService.formatDate(new Date('2018-12-24'), 'week', 'next');

    expect(formatedDate).toEqual("2019-01");
  }));
});
