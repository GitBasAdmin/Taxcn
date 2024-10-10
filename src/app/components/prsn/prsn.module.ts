import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select'; // Import NgSelectModule
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/@shared/shared.module';
import { PrsnRoutingModule } from '@app/components/prsn/prsn-routing.module';

import { Prsn0100Component } from './prsn0100/prsn0100.component';
import { Prsn1200Component } from './prsn1200/prsn1200.component';
import { Prsn1900Component } from './prsn1900/prsn1900.component';
import { Prsn1100Component } from './prsn1100/prsn1100.component';
import { Prsn2100Component } from './prsn2100/prsn2100.component';
import { Prsn3400Component } from './prsn3400/prsn3400.component';

@NgModule({
  declarations: [
    Prsn0100Component,
    Prsn1200Component,
    Prsn1900Component,
    Prsn1100Component,
    Prsn2100Component,
    Prsn3400Component
  ],
  imports: [
    CommonModule,
    PrsnRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [],
})
export class PrsnModule { }