import { TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { NgRedux, DevToolsExtension } from '@angular-redux/store';
import { NgReduxTestingModule, MockNgRedux } from '@angular-redux/store/testing';

import { AppService } from '../app.service';
import { CalendarioService } from './calendario.service';

import { CalendarioActions } from './calendario.actions';
class AppServiceMock{
  apiGet( url ){
    return Observable.of({
      success: true,
      data: []
    })
  }
  apiPost( url, body ){
    return Observable.of({
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
        CalendarioActions
      ]
    });
  });

  it('should be created', inject([CalendarioService], (service: CalendarioService) => {
    expect(service).toBeTruthy();
  }));
  it('should format dates', inject([CalendarioService], (calendarioService: CalendarioService) => {
    let formatedDate= calendarioService.formatDate(new Date('2018-03-15'), 'next', 'month');

    expect(formatedDate).toEqual("2018-4");
    
    formatedDate= calendarioService.formatDate(new Date('2018-03-15'), 'next', 'day');

    expect(formatedDate).toEqual("2018-03-16");
  }));
});
