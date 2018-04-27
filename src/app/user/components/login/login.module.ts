import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../../material.module';

import { LoginComponent } from './login.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    NgbModule.forRoot()
  ],
  declarations: [LoginComponent, LoginDialogComponent],
  exports: [LoginComponent],
  entryComponents: [LoginDialogComponent]
})
export class LoginModule {}
