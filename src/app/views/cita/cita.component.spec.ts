import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaComponent } from './cita.component';

xdescribe('CitaComponent', () => {
  let component: CitaComponent;
  let fixture: ComponentFixture<CitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
