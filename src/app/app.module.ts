import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule,NgSelectConfig } from '@ng-select/ng-select';
import { NgbModule,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { NgxAwesomePopupModule,ConfirmBoxConfigModule,ToastNotificationInitializer, ToastPositionEnum, ToastNotificationConfigModule } from '@costlydeveloper/ngx-awesome-popup';
import { NgxSpinnerModule } from "ngx-spinner";

import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { ExcelService } from './services/excel.service.ts';
import { SharedRunIdService } from './services/run-id.service.ts';

import { CoreModule } from './@core/core.module';
import { SharedModule } from './@shared/shared.module';
import { ShellModule } from '@app/shell/shell.module';






@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,ReactiveFormsModule,
    DataTablesModule,
    NgSelectModule,
    NgbModule,
    CoreModule,
    SharedModule,
    ShellModule,
    NgxAwesomePopupModule.forRoot(),
    ConfirmBoxConfigModule.forRoot(),
    ToastNotificationConfigModule.forRoot(),
    NgxSpinnerModule
  ],
  exports:[
    
  ],
  providers: [NgSelectConfig,NgbActiveModal,{provide: LocationStrategy, useClass: HashLocationStrategy},{provide: Window, useValue: window},AuthService,AuthGuardService,ExcelService,SharedRunIdService],
  bootstrap: [AppComponent]
})
export class AppModule { }
