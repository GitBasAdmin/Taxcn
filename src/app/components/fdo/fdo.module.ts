import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import {MatTabsModule} from '@angular/material/tabs'

import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; //  

import { FdoRoutingModule } from '@app/components/fdo/fdo-routing.module';
import { Fdo0100Component } from '@app/components/fdo/fdo0100/fdo0100.component';
import { Fdo0100Tab1Component } from '@app/components/fdo/fdo0100/fdo0100-tab1/fdo0100-tab1.component';
import { Fdo0100Tab2Component } from '@app/components/fdo/fdo0100/fdo0100-tab2/fdo0100-tab2.component';
import { Fdo0200Component } from '@app/components/fdo/fdo0200/fdo0200.component';
import { Fdo9000Component } from '@app/components/fdo/fdo9000/fdo9000.component';
import { DatalistReturnModelComponent } from './modal/datalist-return-model/datalist-return-model.component';
import { Fdo0500Component } from './fdo0500/fdo0500.component';
import { Fdo0400Component } from './fdo0400/fdo0400.component';
import { ModalConfirmComponent } from './modal/modal-confirm/modal-confirm.component';
import { ModalPrintComponent } from './modal/modal-print/modal-print.component';
import { ModalPrintCoverComponent } from './modal/modal-print-cover/modal-print-cover.component';
import { ModalMaterialComponent } from './modal/modal-material/modal-material.component';
import { ModalConfirmFdoComponent } from './modal/modal-confirm-fdo/modal-confirm-fdo.component';
@NgModule({
  declarations: [
    Fdo0100Component,
    Fdo0100Tab1Component,
    Fdo0100Tab2Component,
    Fdo0200Component,
    Fdo0400Component,
    Fdo0500Component,
    Fdo9000Component,
    DatalistReturnModelComponent,
    ModalConfirmComponent,
    ModalPrintComponent,
    ModalMaterialComponent,
    ModalPrintCoverComponent,
    ModalConfirmFdoComponent,
    // DatalistReturnComponent,
  ],
  imports: [
    CommonModule,
    FdoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatTabsModule,
    ModalModule,
    CaseModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
})
export class FdoModule { }
