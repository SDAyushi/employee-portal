import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { CalenderComponent } from '../calender/calender.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';  // Import MatNativeDateModule

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { OverlayModule } from '@angular/cdk/overlay';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    HeaderComponent,
    CalenderComponent,
    ConfirmationModalComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    OverlayModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule, 
  ],
  exports:[
    HeaderComponent,
    CalenderComponent,
    ConfirmationModalComponent
  ]
})
export class SharedModule { }
