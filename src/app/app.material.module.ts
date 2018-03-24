import { NgModule } from '@angular/core';
import { MatButtonModule, MatCheckboxModule, MatToolbarModule, MatChipsModule, MatOptionModule, MatGridListModule, MatProgressBarModule, MatSliderModule, MatSlideToggleModule, MatMenuModule, MatDialogModule, MatSnackBarModule, MatSelectModule, MatInputModule, MatSidenavModule, MatCardModule, MatIconModule, MatRadioModule, MatProgressSpinnerModule, MatTabsModule, MatListModule,
  MatDatepickerModule, MatNativeDateModule, DateAdapter } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatPaginatorModule, MatPaginatorIntl} from '@angular/material/paginator';
export class MatPaginatorIntlEs extends MatPaginatorIntl {
  itemsPerPageLabel = 'Elementos';
  nextPageLabel     = 'Siguiente';
  previousPageLabel = 'Anterior';
}

@NgModule({
  imports: [
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatChipsModule, MatOptionModule, MatGridListModule, MatProgressBarModule, MatSliderModule, MatSlideToggleModule, MatMenuModule, MatDialogModule, MatSnackBarModule, MatSelectModule, MatInputModule, MatSidenavModule, MatCardModule, MatIconModule, MatRadioModule, MatProgressSpinnerModule, MatTabsModule, MatListModule,
    BrowserAnimationsModule, MatDatepickerModule, MatNativeDateModule, MatPaginatorModule
  ],
  exports: [
    MatButtonModule, MatCheckboxModule, MatToolbarModule, MatChipsModule, MatOptionModule, MatGridListModule, MatProgressBarModule, MatSliderModule, MatSlideToggleModule, MatMenuModule, MatDialogModule, MatSnackBarModule, MatSelectModule, MatInputModule, MatSidenavModule, MatCardModule, MatIconModule, MatRadioModule, MatProgressSpinnerModule, MatTabsModule, MatListModule,
    BrowserAnimationsModule, MatDatepickerModule, MatNativeDateModule, MatPaginatorModule
  ],
  providers: [{provide: MatPaginatorIntl, useClass: MatPaginatorIntlEs}]
})
export class AppMaterialModule { }
