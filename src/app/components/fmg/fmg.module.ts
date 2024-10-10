import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { FmgRoutingModule } from '@app/components/fmg/fmg-routing.module';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTabsModule } from '@angular/material/tabs';
import { ModalModule } from '../modal/modal.module'; // นำเข้า modal
import { CaseModule } from '../case/case.module'; // นำเข้า ข้อมูลเลขคดี

import { Fmg0300Component } from './fmg0300/fmg0300.component';
import { Fmg0200Component } from './fmg0200/fmg0200.component';
import { Fmg0100Component } from './fmg0100/fmg0100.component';
import { Fmg0101Component } from './fmg0101/fmg0101.component';
import { Fmg0101PrintComponent } from './fmg0101_print/fmg0101_print.component';
import { Fmg0102Component } from './fmg0102/fmg0102.component';
import { Fmg0105Component } from './fmg0105/fmg0105.component';
import { Fmg0106Component } from './fmg0106/fmg0106.component';
import { Fmg0120Component } from './fmg0120/fmg0120.component';
import { Fmg1300Component } from './fmg1300/fmg1300.component';
import { Fmg2000Component } from './fmg2000/fmg2000.component';
import { Fmg2100Component } from './fmg2100/fmg2100.component';
import { Fmg2300Component } from './fmg2300/fmg2300.component';
import { Fmg5000Component } from './fmg5000/fmg5000.component';
import { Fmg1203Component } from './fmg1203/fmg1203.component';
import { Fmg1204Component } from './fmg1204/fmg1204.component';
import { Fmg2301Component } from './fmg2301/fmg2301.component';



@NgModule({
  declarations: [
    Fmg0300Component,
    Fmg0200Component,
    Fmg0100Component,
    Fmg0101Component,Fmg0101PrintComponent,
    Fmg0102Component,
    Fmg0105Component,
    Fmg0106Component,
    Fmg0120Component,
    Fmg1300Component,
    Fmg2000Component,
    Fmg2100Component,
    Fmg2300Component,
    Fmg5000Component,
    Fmg1203Component,
    Fmg1204Component,
    Fmg2301Component,
  ],
  imports: [
    CommonModule,
    FmgRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,MatAutocompleteModule,MatTabsModule,
    ModalModule,
    CaseModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
})
export class FmgModule { }