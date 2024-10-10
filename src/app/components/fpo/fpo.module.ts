import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FpoRoutingModule } from '@app/components/fpo/fpo-routing.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';

import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // นำเข้า ข้อมูลเลขคดี


import { Fpo0100Component } from '@app/components/fpo/fpo0100/fpo0100.component';
import { Fpo0110Component } from '@app/components/fpo/fpo0110/fpo0110.component';
import { Fpo0100NoticeComponent } from '@app/components/fpo/fpo0100-notice/fpo0100-notice.component';
import { Fpo0200Component } from '@app/components/fpo/fpo0200/fpo0200.component';
import { Fpo0400Component } from '@app/components/fpo/fpo0400/fpo0400.component';
import { Fpo0500Component } from '@app/components/fpo/fpo0500/fpo0500.component';

@NgModule({
  declarations: [
    Fpo0100Component,
    Fpo0110Component,
    Fpo0100NoticeComponent,
    Fpo0200Component,
    Fpo0400Component,
    Fpo0500Component,
  ],
  imports: [
    CommonModule,
    FpoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ModalModule,
    CaseModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class FpoModule { }

